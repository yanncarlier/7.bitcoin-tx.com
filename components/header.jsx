"use client";

import Link from "next/link";
import { use } from "react";
import { CircleIcon } from "lucide-react";
import { useUser } from "@/lib/auth";
import { signOut } from "@/app/(login)/actions";
import { useRouter } from "next/navigation";
import { UserMenu } from "./user-menu";
import { AuthButtons } from "./auth-buttons";
import { NavigationLinks } from "./navigation-links";

export function Header() {
  const { userPromise } = useUser();
  const user = use(userPromise);
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.refresh();
    router.push("/");
  }

  return (
    <header className="border-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <CircleIcon className="h-10 w-10 text-orange-500" />
          <span className="ml-2 text-xl font-semibold text-white">
            Bitcoin-tx
          </span>
        </Link>
        <Link href="/charts" className="ml-2 text-xl font-semibold text-white">
          Charts
        </Link>
        <Link
          href="/addresses"
          className="ml-2 text-xl font-semibold text-white "
        >
          Addresses
        </Link>
        <Link href="/pricing" className="ml-2 text-xl font-semibold text-white">
          Pricing
        </Link>

        <a
          href="https://www.bitcoin-tx.com/Screenshots/index.html"
          className="ml-2 text-xl font-semibold text-white"
          target="_blank"
          rel="noopener noreferrer"
        >
          Screenshots
        </a>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <NavigationLinks />
              <UserMenu user={user} onSignOut={handleSignOut} />
            </>
          ) : (
            <AuthButtons />
          )}
        </div>
      </div>
    </header>
  );
}
