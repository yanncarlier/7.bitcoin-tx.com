// AuthButtons: Manages authentication buttons

"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AuthButtons() {
  return (
    <>
      <Button
        asChild
        className="btn-primary ml-2 text-xl font-semibold text-white"
      >
        <Link href="/sign-in">Sign In</Link>
      </Button>
      <Button
        asChild
        className="btn-primary ml-2 text-xl font-semibold text-white"
      >
        <Link href="/sign-up">Sign Up</Link>
      </Button>
    </>
  );
}
