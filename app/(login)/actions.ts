"use server";

import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db/drizzle"; // Database connection/instance
import {
  User,
  users,
  teams,
  teamMembers,
  activityLogs,
  type NewUser,
  type NewTeam,
  type NewTeamMember,
  type NewActivityLog,
  ActivityType,
  invitations,
} from "@/lib/db/schema"; // Database schema definitions and types
import { comparePasswords, hashPassword, setSession } from "@/lib/auth/session"; // Authentication utilities
import { redirect } from "next/navigation"; // Next.js redirect utility
import { cookies } from "next/headers"; // Cookie handling utility
import { createCheckoutSession } from "@/lib/payments/stripe"; // Stripe payment integration
import { getUser, getUserWithTeam } from "@/lib/db/queries"; // Custom database query helpers
import {
  validatedAction,
  validatedActionWithUser,
} from "@/lib/auth/middleware"; // Authentication middleware wrappers

// Define ActionState type for createStore return value
type ActionState = {
  success?: string;
  error?: string;
  data?: any;
};

// Logs user activity/team actions to the database
async function logActivity(
  teamId: number | null | undefined,
  userId: number,
  type: ActivityType,
  ipAddress?: string
) {
  if (teamId === null || teamId === undefined) {
    return; // Skip if no team ID provided
  }
  const newActivity: NewActivityLog = {
    teamId,
    userId,
    action: type,
    ipAddress: ipAddress || "",
  };
  await db.insert(activityLogs).values(newActivity); // Insert activity log entry
}

// Schema for sign-in form validation
const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().max(100),
});

// Sign-in action handler
export const signIn = validatedAction(signInSchema, async (data, formData) => {
  const { email, password } = data;

  // Fetch user with team information
  const userWithTeam = await db
    .select({
      user: users,
      team: teams,
    })
    .from(users)
    .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
    .leftJoin(teams, eq(teamMembers.teamId, teams.id))
    .where(eq(users.email, email))
    .limit(1);

  // Check if user exists
  if (userWithTeam.length === 0) {
    return {
      error: "Invalid email or password. Please try again.",
      email,
      password,
    };
  }

  // Verify password
  const { user: foundUser, team: foundTeam } = userWithTeam[0];

  const isPasswordValid = await comparePasswords(
    password,
    foundUser.passwordHash
  );

  if (!isPasswordValid) {
    return {
      error: "Invalid email or password. Please try again.",
      email,
      password,
    };
  }

  // Set session and log sign-in activity
  await Promise.all([
    setSession(foundUser),
    logActivity(foundTeam?.id, foundUser.id, ActivityType.SIGN_IN),
  ]);

  // Handle redirect based on form data
  const redirectTo = formData.get("redirect") as string | null;
  if (redirectTo === "checkout") {
    const priceId = formData.get("priceId") as string;
    return createCheckoutSession({ team: foundTeam, priceId }); // Redirect to Stripe checkout
  }

  redirect("/dashboard"); // Default redirect to dashboard
});

// Schema for sign-up form validation
const signUpSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(14, "Password must be at least 14 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
      "Password must include uppercase and lowercase letters, numbers, and special characters"
    ),
  inviteId: z.string().optional(),
});

// Sign-up action handler
export const signUp = validatedAction(signUpSchema, async (data, formData) => {
  const { email, password, inviteId } = data;

  // Check if user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return {
      error: "Failed to create user. Please try again.",
      email,
      password,
    };
  }

  const passwordHash = await hashPassword(password);

  // Create new user
  const newUser: NewUser = {
    email,
    passwordHash,
    role: "owner", // Default role, will be overridden if there's an invitation
  };

  const [createdUser] = await db.insert(users).values(newUser).returning();

  if (!createdUser) {
    return {
      error: "Failed to create user. Please try again.",
      email,
      password,
    };
  }

  // BTCpay create new user account
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append(
    "Authorization",
    `token ${process.env.BTCPAY_SERVER_CANMANAGEUSERS}`
  );

  const raw = JSON.stringify({
    email: email,
    password: password,
    isAdministrator: false, // Default to non-administrator
  });

  const requestOptionsUser = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow" as RequestRedirect,
  };

  const btcpayUrl = process.env.BTCPAY_API_URL;

  const response = await fetch(btcpayUrl + `/api/v1/users`, requestOptionsUser);

  if (!response.ok) {
    console.log("Bad response from BTCpay server");
    throw new Error("Bad response from BTCpay server");
  }

  const createdBtcpayUser = await response.json();

  if (!createdBtcpayUser) {
    return {
      error: "Failed to create BTCpay user. Please try again.",
      email,
      password,
    };
  }

  let teamId: number;
  let userRole: string;
  let createdTeam: typeof teams.$inferSelect | null = null;

  // Handle invitation flow
  if (inviteId) {
    const [invitation] = await db
      .select()
      .from(invitations)
      .where(
        and(
          eq(invitations.id, parseInt(inviteId)),
          eq(invitations.email, email),
          eq(invitations.status, "pending")
        )
      )
      .limit(1);

    if (invitation) {
      teamId = invitation.teamId;
      userRole = invitation.role;

      await db
        .update(invitations)
        .set({ status: "accepted" })
        .where(eq(invitations.id, invitation.id));

      await logActivity(teamId, createdUser.id, ActivityType.ACCEPT_INVITATION);

      [createdTeam] = await db
        .select()
        .from(teams)
        .where(eq(teams.id, teamId))
        .limit(1);
    } else {
      return { error: "Invalid or expired invitation.", email, password };
    }
  } else {
    // Create a new team if there's no invitation
    const newTeam: NewTeam = {
      name: `${email}'s Team`,
    };

    [createdTeam] = await db.insert(teams).values(newTeam).returning();

    if (!createdTeam) {
      return {
        error: "Failed to create team. Please try again.",
        email,
        password,
      };
    }

    teamId = createdTeam.id;
    userRole = "owner";

    await logActivity(teamId, createdUser.id, ActivityType.CREATE_TEAM);
  }

  // Add user to team
  const newTeamMember: NewTeamMember = {
    userId: createdUser.id,
    teamId: teamId,
    role: userRole,
  };

  // Complete signup process
  await Promise.all([
    db.insert(teamMembers).values(newTeamMember),
    logActivity(teamId, createdUser.id, ActivityType.SIGN_UP),
    setSession(createdUser),
  ]);

  // Handle redirect
  const redirectTo = formData.get("redirect") as string | null;
  if (redirectTo === "checkout") {
    const priceId = formData.get("priceId") as string;
    return createCheckoutSession({ team: createdTeam, priceId });
  }

  redirect("/dashboard");
});

// Sign-out action handler
export async function signOut() {
  const user = (await getUser()) as User;
  const userWithTeam = await getUserWithTeam(user.id);
  await logActivity(userWithTeam?.teamId, user.id, ActivityType.SIGN_OUT);
  (await cookies()).delete("session");
}

// Update Password Schema
const updatePasswordSchema = z
  .object({
    currentPassword: z.string().max(100),
    newPassword: z
      .string()
      .min(14, "Password must be at least 14 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
        "Password must include uppercase and lowercase letters, numbers, and special characters"
      ),
    confirmPassword: z.string().max(100),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Password update action handler
export const updatePassword = validatedActionWithUser(
  updatePasswordSchema,
  async (data, _, user) => {
    const { currentPassword, newPassword } = data;

    // Verify current password
    const isPasswordValid = await comparePasswords(
      currentPassword,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return { error: "Current password is incorrect." };
    }

    if (currentPassword === newPassword) {
      return {
        error: "New password must be different from the current password.",
      };
    }

    const newPasswordHash = await hashPassword(newPassword);
    const userWithTeam = await getUserWithTeam(user.id);

    // Update password and log activity
    await Promise.all([
      db
        .update(users)
        .set({ passwordHash: newPasswordHash })
        .where(eq(users.id, user.id)),
      logActivity(userWithTeam?.teamId, user.id, ActivityType.UPDATE_PASSWORD),
    ]);

    return { success: "Password updated successfully." };
  }
);

// Schema for account deletion validation
const deleteAccountSchema = z.object({
  password: z.string().max(100),
});

// Account deletion action handler
export const deleteAccount = validatedActionWithUser(
  deleteAccountSchema,
  async (data, _, user) => {
    const { password } = data;

    // Verify password
    const isPasswordValid = await comparePasswords(password, user.passwordHash);
    if (!isPasswordValid) {
      return { error: "Incorrect password. Account deletion failed." };
    }

    const userWithTeam = await getUserWithTeam(user.id);

    await logActivity(
      userWithTeam?.teamId,
      user.id,
      ActivityType.DELETE_ACCOUNT
    );

    // Perform soft delete by marking account as deleted
    await db
      .update(users)
      .set({
        deletedAt: sql`CURRENT_TIMESTAMP`,
        email: sql`CONCAT(email, '-', id, '-deleted')`, // Ensure email uniqueness
      })
      .where(eq(users.id, user.id));

    // Remove team membership if exists
    if (userWithTeam?.teamId) {
      await db
        .delete(teamMembers)
        .where(
          and(
            eq(teamMembers.userId, user.id),
            eq(teamMembers.teamId, userWithTeam.teamId)
          )
        );
    }

    (await cookies()).delete("session"); // Clear session
    redirect("/sign-in");
  }
);

// Schema for account update validation
const updateAccountSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
});

// Account update action handler
export const updateAccount = validatedActionWithUser(
  updateAccountSchema,
  async (data, _, user) => {
    const { name, email } = data;
    const userWithTeam = await getUserWithTeam(user.id);

    // Update account details and log activity
    await Promise.all([
      db.update(users).set({ name, email }).where(eq(users.id, user.id)),
      logActivity(userWithTeam?.teamId, user.id, ActivityType.UPDATE_ACCOUNT),
    ]);

    return { success: "Account updated successfully." };
  }
);

// Schema for team member removal validation
const removeTeamMemberSchema = z.object({
  memberId: z.number(),
});

// Team member removal action handler
export const removeTeamMember = validatedActionWithUser(
  removeTeamMemberSchema,
  async (data, _, user) => {
    const { memberId } = data;
    const userWithTeam = await getUserWithTeam(user.id);

    if (!userWithTeam?.teamId) {
      return { error: "User is not part of a team" };
    }

    // Remove team member and log activity
    await db
      .delete(teamMembers)
      .where(
        and(
          eq(teamMembers.id, memberId),
          eq(teamMembers.teamId, userWithTeam.teamId)
        )
      );

    await logActivity(
      userWithTeam.teamId,
      user.id,
      ActivityType.REMOVE_TEAM_MEMBER
    );

    return { success: "Team member removed successfully" };
  }
);

// Schema for team member invitation validation
const inviteTeamMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["member", "owner"]),
});

// Team member invitation action handler
export const inviteTeamMember = validatedActionWithUser(
  inviteTeamMemberSchema,
  async (data, _, user) => {
    const { email, role } = data;
    const userWithTeam = await getUserWithTeam(user.id);

    if (!userWithTeam?.teamId) {
      return { error: "User is not part of a team" };
    }

    // Check if user is already a team member
    const existingMember = await db
      .select()
      .from(users)
      .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
      .where(
        and(eq(users.email, email), eq(teamMembers.teamId, userWithTeam.teamId))
      )
      .limit(1);

    if (existingMember.length > 0) {
      return { error: "User is already a member of this team" };
    }

    // Check for existing pending invitation
    const existingInvitation = await db
      .select()
      .from(invitations)
      .where(
        and(
          eq(invitations.email, email),
          eq(invitations.teamId, userWithTeam.teamId),
          eq(invitations.status, "pending")
        )
      )
      .limit(1);

    if (existingInvitation.length > 0) {
      return { error: "An invitation has already been sent to this email" };
    }

    // Create a new invitation
    await db.insert(invitations).values({
      teamId: userWithTeam.teamId,
      email,
      role,
      invitedBy: user.id,
      status: "pending",
    });

    await logActivity(
      userWithTeam.teamId,
      user.id,
      ActivityType.INVITE_TEAM_MEMBER
    );

    // TODO: Send invitation email and include ?inviteId={id} to sign-up URL
    // await sendInvitationEmail(email, userWithTeam.team.name, role)

    return { success: "Invitation sent successfully" };
  }
);

// ################### generate Mnemonic #########################
// export const generateMnemonic = async (): Promise<ActionState> => {
//   const apiAddresses = process.env.BE_API_ADDRESSES; // Base URL for the API
//   if (!apiAddresses) {
//     return { error: "API address not configured." };
//   }

//   try {
//     const response = await fetch(`${apiAddresses}/generate-mnemonic`);
//     if (!response.ok) {
//       throw new Error("Failed to generate mnemonic");
//     }
//     const data = await response.json();
//     return {
//       success: "Mnemonic generated successfully.",
//       data: data.BIP39Mnemonic,
//     };
//   } catch (error) {
//     return {
//       error: error instanceof Error ? error.message : "An error occurred",
//     };
//   }
// };

// ################### generate BIP84 Address #########################
// export const generateBip84Address = async (mnemonic: string): Promise<ActionState> => {
//   const apiAddresses = process.env.BE_API_ADDRESSES;
//   if (!apiAddresses) {
//     return { error: "API address not configured." };
//   }

//   const payload = {
//     mnemonic: mnemonic,
//     passphrase: "",
//     num_addresses: 1,
//     include_private_keys: false,
//   };

//   try {
//     const response = await fetch(`${apiAddresses}/generate-bip84-addresses`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to generate BIP84 address");
//     }

//     const data = await response.json();
//     return {
//       success: "BIP84 address generated successfully.",
//       data: data,
//     };
//   } catch (error) {
//     return {
//       error: error instanceof Error ? error.message : "An error occurred",
//     };
//   }
// };

// ############################
// BTCPay Create a new store and wallet
// ############################


export const createStore = async (
  state: ActionState,
  formData: FormData
): Promise<ActionState> => {
  // Extract email and password from form data
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const mnemonic = formData.get("mnemonic") as string | null;

  // Validate that email and password are provided
  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  // Retrieve the current authenticated user
  const user = await getUser();
  if (!user) {
    return { error: "User not authenticated." };
  }

  // Check if the form email matches the user's account email
  if (email !== user.email) {
    return { error: "The provided email does not match your account email." };
  }



  // Check if user already has a store
 let existingUserStores = await db
 .select()
 .from(users)
 .where(and(eq(users.email, email), eq(users.stores, 1)))
 .limit(1);


 if (existingUserStores.length === 1) {
   return { error: "You already have one store, you can delete it to create a new one or upgrade your Current Plan" };
 } 
  
  // Check if the user has a store
  // If the user doesn't have a store, update the 'stores' column to "1" (indicating a store exists)
  // This is done to prevent multiple stores for the same user.
 await db.update(users).set({ stores: 1 }).where(eq(users.email, email));


  // Proceed with store and wallet creation
  const authString = `${email}:${password}`;
  const encodedAuthString = btoa(authString); // Base64 encoding for Basic Auth

  const btcpayUrl = process.env.BTCPAY_API_URL;
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Authorization", `Basic ${encodedAuthString}`);

  // Store creation payload
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const storeName = `Hot_Store-${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;

  const storePayload = JSON.stringify({
    name: storeName,
    website: btcpayUrl,
    networkFeeMode: "MultiplePaymentsOnly",
  });

  const storeRequestOptions = {
    method: "POST",
    headers: headers,
    body: storePayload,
    redirect: "follow" as RequestRedirect,
  };

  try {
    const storeResponse = await fetch(
      `${btcpayUrl}/api/v1/stores`,
      storeRequestOptions
    );

    if (!storeResponse.ok) {
      return { error: "Store creation failed on server." };
    }

    const storeData = await storeResponse.json();
    const storeId = storeData.id; // Extract store ID from the response

    // Initialize tracking arrays and data object
    const createdItems: string[] = ["Store"];
    const failedItems: string[] = [];
    const data: any = { store: storeData };

    // Step 2: Prepare wallet creation payload (used for both wallets)
    let walletPayload;
    if (mnemonic) {
      walletPayload = JSON.stringify({
        existingMnemonic: mnemonic,
        passphrase: "",
        accountNumber: 0,
        savePrivateKeys: false,
        importKeysToRPC: false,
        wordList: "English",
        wordCount: 12,
        scriptPubKeyType: "Segwit",
      });
    } else {
      walletPayload = JSON.stringify({
        existingMnemonic: null,
        passphrase: "",
        accountNumber: 0,
        savePrivateKeys: false,
        importKeysToRPC: false,
        wordList: "English",
        wordCount: 12,
        scriptPubKeyType: "Segwit",
      });
    }

    // Wallet request options (reused for both BTC and LBTC)
    const walletRequestOptions = {
      method: "POST",
      headers: headers,
      body: walletPayload,
      redirect: "follow" as RequestRedirect,
    };

    // Step 3: Create BTC wallet
    try {
      const btcWalletUrl = `${btcpayUrl}/api/v1/stores/${storeId}/payment-methods/BTC/wallet/generate`;
      const btcWalletResponse = await fetch(btcWalletUrl, walletRequestOptions);

      if (btcWalletResponse.ok) {
        const btcWalletData = await btcWalletResponse.json();

        const storeMnemonic = btcWalletData.mnemonic; // Extract mnemonic from the response
        // console.log("Store mnemonic:", storeMnemonic);

        createdItems.push("BTC wallet");
        data.btcWallet = btcWalletData;
      } else {
        failedItems.push("BTC wallet");
      }
    } catch {
      failedItems.push("BTC wallet");
    }

    // Step 4: Create LBTC wallet
    try {
      const lbtcWalletUrl = `${btcpayUrl}/api/v1/stores/${storeId}/payment-methods/LBTC/wallet/generate`;
      const lbtcWalletResponse = await fetch(
        lbtcWalletUrl,
        walletRequestOptions
      );

      if (lbtcWalletResponse.ok) {
        const lbtcWalletData = await lbtcWalletResponse.json();
        createdItems.push("LBTC wallet");
        data.lbtcWallet = lbtcWalletData;
      } else {
        failedItems.push("LBTC wallet");
      }
    } catch {
      failedItems.push("LBTC wallet");
    }

    // Step x: Create USDT wallet
    try {
      const usdtWalletUrl = `${btcpayUrl}/api/v1/stores/${storeId}/payment-methods/USDT/wallet/generate`;
      const usdtWalletResponse = await fetch(
        usdtWalletUrl,
        walletRequestOptions
      );

      if (usdtWalletResponse.ok) {
        const usdtWalletData = await usdtWalletResponse.json();
        createdItems.push("USDT wallet");
        data.usdtWallet = usdtWalletData;
      } else {
        failedItems.push("USDT wallet");
      }
    } catch {
      failedItems.push("USDT wallet");
    }

    // Step x: Create LCAD wallet
    try {
      const lcadWalletUrl = `${btcpayUrl}/api/v1/stores/${storeId}/payment-methods/LCAD/wallet/generate`;
      const lcadWalletResponse = await fetch(
        lcadWalletUrl,
        walletRequestOptions
      );

      if (lcadWalletResponse.ok) {
        const lcadWalletData = await lcadWalletResponse.json();
        createdItems.push("LCAD wallet");
        data.lcadWallet = lcadWalletData;
      } else {
        failedItems.push("LCAD wallet");
      }
    } catch {
      failedItems.push("LCAD wallet");
    }

    // Step 5: Construct success and error messages
    const successMessage = `${createdItems.join(", ")} created successfully.`;
    const errorMessage =
      failedItems.length > 0
        ? `${failedItems.join(", ")} creation failed.`
        : undefined;

    // Step 6: Return the result
    return {
      success: successMessage,
      error: errorMessage,
      data,
    };
  } catch (error) {
    return {
      error:
        "An unexpected error occurred while creating the store or wallets.",
    };
  }

};
