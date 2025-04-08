"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { customerPortalAction } from "@/lib/payments/actions";
import { useActionState } from "react";
import { TeamDataWithMembers, User } from "@/lib/db/schema";
import { removeTeamMember } from "@/app/(login)/actions";
import StoreSettings from "@/components/store-settings"; // Import StoreSettings component

type ActionState = {
  error?: string;
  success?: string;
};

export function Settings({ teamData }: { teamData: TeamDataWithMembers }) {
  const [removeState, removeAction, isRemovePending] = useActionState<
    ActionState,
    FormData
  >(removeTeamMember, { error: "", success: "" });

  const getUserDisplayName = (user: Pick<User, "id" | "name" | "email">) => {
    return user.name || user.email || "Unknown User";
  };

  // const user = (teamData as any)[0].user; // Avoid unless necessary
  // console.log(teamData);

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
        Subscription Settings
      </h1>
      <Card className="mb-8 w-full bg-gray-800 border border-gray-700 shadow-lg rounded-lg p-6 md:max-w-md lg:max-w-lg xl:max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-orange-500">
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-4 sm:mb-0">
                <p className="font-medium">
                  Current Plan: {teamData.planName || "Free"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {teamData.subscriptionStatus === "active"
                    ? "Billed monthly"
                    : teamData.subscriptionStatus === "trialing"
                    ? "Trial period"
                    : "No active subscription"}
                </p>
              </div>
              <form action={customerPortalAction}>
                <Button
                  type="submit"
                  className="btn-primary ml-2 text-xl font-semibold text-white"
                >
                  Manage Subscription
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conditionally render StoreSettings if the plan is not Free */}
      {(teamData.planName && teamData.planName.toLowerCase() !== "free" && (
        <StoreSettings />
      )) || (
        <Card className="mb-8 w-full bg-gray-800 border border-gray-700 shadow-lg rounded-lg p-6 md:max-w-md lg:max-w-lg xl:max-w-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-orange-500">
              Subscription Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-200">
              You need an active or trialing subscription to create a store and
              wallets. Please upgrade your plan to proceed.
            </p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
