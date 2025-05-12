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
import { Loader2, Copy } from "lucide-react";
import { useUser } from "@/lib/auth";
import { createStore, generateMnemonic } from "@/app/(login)/actions";
import { QRCodeCanvas } from "qrcode.react";

export default function StoreSettings() {
  const { userPromise } = useUser();
  const user = use(userPromise);
  const router = useRouter();

  // State for createStore action
  type ActionState = {
    error: string;
    success: string;
    data: any;
  };
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    createStore as any,
    { error: "", success: "", data: "" }
  );

  // State for mnemonic handling
  const [mnemonic, setMnemonic] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [qrContent, setQrContent] = useState<string | null>(null);

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
    const result = await generateMnemonic();
    if (result.error) {
      setGenerateError(result.error);
    } else if (result.data) {
      setMnemonic(result.data);
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

  // Handle copy to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  // Show QR code
  const showQr = (content: string) => {
    setQrContent(content);
  };

  return (
    <section>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
        Create a new store
      </h1>

      <Card className="mb-8 w-full bg-gray-800 border border-gray-700 shadow-lg rounded-lg p-6 md:max-w-md lg:max-w-lg xl:max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-orange-500">
            New Store
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!state.success ? (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email" className="text-sm text-gray-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.email || ""}
                  disabled
                  className="mt-1 w-full rounded-md px-3 py-1.5 text-sm border-gray-300"
                />
                <input type="hidden" name="email" value={user?.email || ""} />
              </div>
              <div>
                <Label htmlFor="password" className="text-sm text-gray-200">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 w-full rounded-md px-3 py-1.5 text-sm border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="mnemonic" className="text-sm text-gray-200">
                  Mnemonic (optional)
                </Label>
                <div className="flex items-start mt-1 space-x-2">
                  <textarea
                    id="mnemonic"
                    name="mnemonic"
                    value={mnemonic}
                    onChange={(e) => setMnemonic(e.target.value)}
                    className="flex-1 text-sm p-2 border border-gray-300 rounded-md bg-gray-800 text-white min-h-[80px]"
                    placeholder="Enter mnemonic phrase"
                  />
                  <div className="flex flex-col space-y-2">
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        onClick={() => mnemonic && handleCopy(mnemonic)}
                        className="p-1 bg-gray-700 hover:bg-gray-600"
                        size="sm"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        onClick={() => mnemonic && showQr(mnemonic)}
                        className="p-1 bg-gray-700 hover:bg-gray-600"
                        size="sm"
                      >
                        QR
                      </Button>
                    </div>
                    <Button
                      type="button"
                      onClick={handleGenerateMnemonic}
                      className="btn-primary text-white w-full"
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                          Generating
                        </>
                      ) : (
                        "Generate"
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-red-500 text-xs mt-1">
                  Caution: If you provide a mnemonic, ensure it is stored securely. Anyone with access can control your wallet.
                </p>
                <p className="text-yellow-500 text-xs mt-1">
                  Important: Save your mnemonic and store it securely offline as a backup. It’s your key to recovering your funds in case of an emergency.
                </p>
                {generateError && (
                  <p className="text-red-500 text-xs mt-1">{generateError}</p>
                )}
              </div>
              <Button
                type="submit"
                className="btn-primary text-xl font-semibold text-white"
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
          ) : (
            <div className="mt-4 space-y-2">
              <p className="text-green-500 text-xs">{state.success}</p>
              <Button
                className="btn-primary text-xl font-semibold text-white"
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
              {state.data.btcWallet && state.data.btcWallet.mnemonic && (
                <div className="mt-4">
                  <Label className="text-sm text-gray-200">
                    Mnemonic
                  </Label>
                  <div className="flex items-start mt-1 space-x-2">
                    <textarea
                      value={state.data.btcWallet.mnemonic}
                      readOnly
                      className="flex-1 text-sm p-2 border border-gray-300 rounded-md bg-gray-800 text-white min-h-[80px]"
                    />
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        onClick={() => handleCopy(state.data.btcWallet.mnemonic)}
                        className="p-1 bg-gray-700 hover:bg-gray-600"
                        size="sm"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        onClick={() => showQr(state.data.btcWallet.mnemonic)}
                        className="p-1 bg-gray-700 hover:bg-gray-600"
                        size="sm"
                      >
                        QR
                      </Button>
                    </div>
                  </div>
                  <p className="text-yellow-500 text-xs mt-2">
                    Important: Save this mnemonic and store it securely offline as a backup. It’s your key to recovering your funds in case of an emergency.
                  </p>
                  <p className="text-red-500 text-xs mt-1">
                    Caution: Anyone with access to this mnemonic can take full control of your wallet. Keep it safe!
                  </p>
                </div>
              )}
            </div>
          )}
          {state.error && !state.success && (
            <p className="text-red-500 text-xs mt-4">{state.error}</p>
          )}
        </CardContent>
      </Card>

      {/* QR Code Modal */}
      {qrContent && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => setQrContent(null)}
        >
          <div className="bg-white p-4 rounded">
            <QRCodeCanvas value={qrContent} size={256} level="H" />
          </div>
          <button
            className="absolute top-4 right-4 text-white text-lg"
            onClick={() => setQrContent(null)}
          >
            Close
          </button>
        </div>
      )}
    </section>
  );
}