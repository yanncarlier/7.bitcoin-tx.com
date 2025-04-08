// app/(login)/login.tsx
"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleIcon, Loader2 } from "lucide-react";
import { signIn, signUp } from "./actions";
import { ActionState } from "@/lib/auth/middleware";

export function Login({ mode = "signin" }: { mode?: "signin" | "signup" }) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const priceId = searchParams.get("priceId");
  const inviteId = searchParams.get("inviteId");
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    mode === "signin" ? signIn : signUp,
    { error: "" }
  );

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4 min-h-[50dvh]">
      <Card className="bg-gray-800 border border-gray-700 shadow-lg rounded-lg p-6 w-110">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-orange-500 text-center">
            {mode === "signin" ? "Sign in" : "Sign up"}
          </CardTitle>
        </CardHeader>

        <CardContent className="py-3">
          <form className="space-y-3" action={formAction}>
            <input type="hidden" name="redirect" value={redirect || ""} />
            <input type="hidden" name="priceId" value={priceId || ""} />
            <input type="hidden" name="inviteId" value={inviteId || ""} />
            <div>
              <Label htmlFor="email" className="text-sm text-gray-200">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                defaultValue={state.email}
                required
                maxLength={50}
                className="mt-1 w-full rounded-md px-3 py-1.5 border-gray-300 text-sm placeholder-gray-500 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Email"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm text-gray-200">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={
                  mode === "signin" ? "current-password" : "new-password"
                }
                defaultValue={state.password}
                required
                minLength={14}
                maxLength={100}
                className="mt-1 w-full rounded-md px-3 py-1.5 border-gray-300 text-sm placeholder-gray-500 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Password"
              />
              {mode === "signup" && (
                <div className="text-xs text-gray-500 mt-1">
                  Password must include uppercase and lowercase letters,
                  numbers, and special characters
                </div>
              )}
            </div>

            {state?.error && (
              <div className="bg-orange-500 text-xs">{state.error}</div>
            )}

            {/* Agreement Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="agree"
                name="agree"
                required
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="agree" className="text-sm text-gray-200">
                I agree to the{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            {/* Center the button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                className="btn-primary text-xl font-semibold text-white"
                disabled={pending}
              >
                {pending ? (
                  <>
                    <Loader2 className="animate-spin mr-1 h-4 w-4" />
                    Loading
                  </>
                ) : mode === "signin" ? (
                  "Sign in"
                ) : (
                  "Sign up"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500">
              {mode === "signin" ? "New here?" : "Have an account?"}{" "}
              <Link
                href={`${mode === "signin" ? "/sign-up" : "/sign-in"}${
                  redirect ? `?redirect=${redirect}` : ""
                }${priceId ? `&priceId=${priceId}` : ""}`}
                className="text-orange-600 hover:underline"
              >
                {mode === "signin" ? "Sign up" : "Sign in"}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
