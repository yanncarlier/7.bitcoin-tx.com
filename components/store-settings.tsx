"use client";

import {
  startTransition,
  use,
  useActionState,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useUser } from "@/lib/auth";
import { createStore, generateMnemonic } from "@/app/(login)/actions";

export default function StoreSettings() {
  const { userPromise } = useUser();
  const user = use(userPromise);
  const router = useRouter();
  type ActionState = {
    error: string;
    success: string;
    data: any;
  };

  // State for createStore action
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    createStore as any,
    { error: "", success: "", data: "" }
  );

  // State for mnemonic handling
  const [mnemonic, setMnemonic] = useState<string>("");
  const [generatedMnemonic, setGeneratedMnemonic] = useState<string | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  if (!user) {
    return (
      <section className="flex-1 p-4">
        <p className="text-sm">Redirecting...</p>
      </section>
    );
  }

  // Handle mnemonic generation
  const handleGenerateMnemonic = async () => {
    setIsGenerating(true);
    setGenerateError(null);
    setGeneratedMnemonic(null);

    const result = await generateMnemonic();
    if (result.error) {
      setGenerateError(result.error);
    } else if (result.data) {
      setGeneratedMnemonic(result.data);
    }
    setIsGenerating(false);
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(() => {
      formAction(new FormData(event.currentTarget));
    });
  };

  return (
    <section>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
        Store Settings
      </h1>

      {/* Generate Mnemonic Section */}
      <Card className="mb-8 w-full bg-gray-800 border border-gray-700 shadow-lg rounded-lg p-6 md:max-w-md lg:max-w-lg xl:max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-orange-500">
            Generate Mnemonic for Wallet (Optional)
          </CardTitle>
          <p className="text-xs text-gray-200">
            {/* Generate a new BIP39 mnemonic phrase to use for your store's
            wallets.  */}
            If you don’t generate here a mnemonic for your wallet, the system
            will automatically generate one when you create a store and wallet
            below. Use this feature at your own risk.
          </p>
        </CardHeader>
        <CardContent className="py-3">
          <Button
            onClick={handleGenerateMnemonic}
            className="btn-primary ml-2 text-xl font-semibold text-white "
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                Generating
              </>
            ) : (
              "Generate Mnemonic"
            )}
          </Button>
          {generatedMnemonic && (
            <div className="mt-4 space-y-2">
              <Label className="text-sm text-gray-200">
                Generated Mnemonic
              </Label>
              <textarea
                value={generatedMnemonic}
                readOnly
                className="mt-1 w-full text-sm p-2 border border-gray-300 rounded-md bg-gray-800 text-white min-h-[80px]"
              />
              <p className="text-yellow-500 text-xs mb-2">
                Important: If you use this mnemonic for store wallets, save this
                mnemonic and store it securely offline as a backup. It’s your
                key to recovering your funds in case of an emergency.
              </p>
              <p className="text-red-500 text-xs mb-2">
                Caution: If you use this mnemonic for store wallets, anyone with
                access to this mnemonic can take full control of your wallet.
                Keep it safe!
              </p>

              <Button
                onClick={() => setMnemonic(generatedMnemonic)}
                className="btn-primary ml-2 text-xl font-semibold text-white"
              >
                Use this mnemonic for store wallets
              </Button>
            </div>
          )}
          {generateError && (
            <p className="text-red-500 text-xs mt-3">{generateError}</p>
          )}
        </CardContent>
      </Card>

      {/* Create Store Form */}
      <Card className="mb-8 w-full bg-gray-800 border border-gray-700 shadow-lg rounded-lg p-6 md:max-w-md lg:max-w-lg xl:max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-orange-500">
            Create a Store & Wallets
          </CardTitle>
          <p>
            Use the same credentials to create a new store with hot wallets for
            BTC, LBTC, USDt, and LCAD.
          </p>
          <p className="text-xs text-gray-500">
            We are not liable for losses. Hot wallets have security risks. Use
            this feature at your own risk.
            {/* If you disclose the information
            produced on this page to others, they could take your assets. */}
          </p>
        </CardHeader>
        <CardContent className="py-3">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="text-sm text-gray-200">
                Email
              </Label>{" "}
              {/* <br />
              <Label htmlFor="email" className="text-sm text-gray-200">
                {user?.email}
              </Label> */}
              <Input
                // id="email"
                // name="email"
                // type="email"
                placeholder="Email"
                defaultValue={user?.email || ""}
                required
                disabled
                className="mt-1 w-full rounded-md px-3 py-1.5 text-sm border-gray-300"
              />
              <input
                id="email"
                type="hidden"
                name="email"
                value={user?.email || ""}
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
                placeholder="Password"
                required
                className="mt-1 w-full rounded-md px-3 py-1.5 text-sm border-gray-300"
              />
            </div>
            <div>
              <Label htmlFor="mnemonic" className="text-sm text-gray-200">
                Mnemonic (optional)
              </Label>
              <Input
                id="mnemonic"
                name="mnemonic"
                type="text"
                placeholder="Enter mnemonic phrase"
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
                className="mt-1 w-full rounded-md px-3 py-1.5 text-sm border-gray-300"
              />
            </div>
            <Button
              type="submit"
              className="btn-primary ml-2 text-xl font-semibold text-white"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  Creating
                </>
              ) : (
                "Create Store"
              )}
            </Button>
          </form>
          <div className="mt-3 space-y-2">
            {state.error && (
              <p className="text-red-500 text-xs">{state.error}</p>
            )}
            {state.success && (
              <p className="text-green-500 text-xs">{state.success}</p>
            )}
            {state.data && (
              <Button
                type="submit"
                className="btn-primary ml-2 text-xl font-semibold text-white"
                asChild
              >
                <a
                  href={`https://btcpay.bitcoin-tx.com/stores/${state.data.store.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Store Sign In
                </a>
              </Button>
            )}
            {state.data &&
              state.data.btcWallet &&
              state.data.btcWallet.mnemonic && (
                <div className="mt-4">
                  <Label className="text-sm text-gray-200">
                    Wallets Mnemonic
                  </Label>
                  <p className="text-yellow-500 text-xs mb-2">
                    Important: Save this mnemonic and store it securely offline
                    as a backup. It’s your key to recovering your funds in case
                    of an emergency.
                  </p>
                  <p className="text-red-500 text-xs mb-2">
                    Caution: Anyone with access to this mnemonic can take full
                    control of your wallet. Keep it safe!
                  </p>
                  <textarea
                    value={state.data.btcWallet.mnemonic}
                    readOnly
                    className="mt-1 w-full text-sm p-2 border border-gray-300 rounded-md bg-gray-800 text-white min-h-[80px]"
                  />
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
