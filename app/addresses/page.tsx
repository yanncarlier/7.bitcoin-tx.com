"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Copy } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

// Type definitions remain unchanged
type MnemonicResponse = {
  BIP39Mnemonic: string;
  BIP39Seed: string;
};

type AddressDetails = {
  derivation_path: string;
  address: string;
  public_key: string;
  private_key?: string | null;
  wif?: string | null;
};

type AddressListResponse = {
  addresses: AddressDetails[];
};

export default function BitcoinAddressPage() {
  // Existing state declarations
  const [newMnemonic, setNewMnemonic] = useState<string | null>(null);
  const [newSeed, setNewSeed] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [addressType, setAddressType] = useState<string>("bip84");
  const [addressMnemonic, setAddressMnemonic] = useState<string>("");
  const [addressPassphrase, setAddressPassphrase] = useState<string>("");
  const [addressNumAddresses, setAddressNumAddresses] = useState<number>(1);
  const [addressIncludePrivateKeys, setAddressIncludePrivateKeys] =
    useState<boolean>(false);
  const [generatedAddresses, setGeneratedAddresses] = useState<
    AddressDetails[] | null
  >(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState<boolean>(false);
  const [errorAddresses, setErrorAddresses] = useState<string | null>(null);

  // New state for QR code
  const [qrContent, setQrContent] = useState<string | null>(null);

  const apiAddresses = process.env.NEXT_PUBLIC_API_ADDRESSES;

  // Endpoint and display name mappings remain unchanged
  const endpointMap: { [key: string]: string } = {
    bip32: "generate-bip32-addresses",
    bip44: "generate-bip44-addresses",
    bip49: "generate-bip49-addresses",
    bip84: "generate-bip84-addresses",
    bip86: "generate-bip86-addresses",
    "bip141-wrapped": "generate-bip141-wrapped-segwit-via-bip49",
    "bip141-native": "generate-bip141-native-segwit-via-bip84",
  };

  const displayNames: { [key: string]: string } = {
    bip32: "BIP32",
    bip44: "BIP44",
    bip49: "BIP49",
    bip84: "BIP84",
    bip86: "BIP86",
    "bip141-wrapped": "BIP141 Wrapped SegWit via BIP49",
    "bip141-native": "BIP141 Native SegWit via BIP84",
  };

  // Existing handlers
  const handleGenerateMnemonic = async () => {
    setIsLoading(true);
    setError(null);
    setNewMnemonic(null);
    setNewSeed(null);
    try {
      const response = await fetch(`${apiAddresses}/generate-mnemonic`);
      if (!response.ok) throw new Error("Failed to generate mnemonic");
      const data: MnemonicResponse = await response.json();
      setNewMnemonic(data.BIP39Mnemonic);
      setNewSeed(data.BIP39Seed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAddresses = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressMnemonic.trim()) {
      setErrorAddresses("Mnemonic is required");
      return;
    }
    if (addressNumAddresses < 1 || addressNumAddresses > 42) {
      setErrorAddresses("Number of addresses must be between 1 and 42");
      return;
    }
    setIsLoadingAddresses(true);
    setErrorAddresses(null);
    setGeneratedAddresses(null);
    const requestBody = {
      mnemonic: addressMnemonic,
      passphrase: addressPassphrase,
      num_addresses: addressNumAddresses,
      include_private_keys: addressIncludePrivateKeys,
    };
    try {
      const endpoint = endpointMap[addressType];
      const response = await fetch(`${apiAddresses}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) throw new Error("Failed to generate addresses");
      const data: AddressListResponse = await response.json();
      setGeneratedAddresses(data.addresses);
    } catch (err) {
      setErrorAddresses(
        err instanceof Error ? err.message : "An error occurred"
      );
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const handleCopy = (text: string | null) => {
    if (text) {
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  };

  // New QR code handlers
  const showQr = (content: string) => {
    setQrContent(content);
  };

  const hideQr = () => {
    setQrContent(null);
  };

  return (
    <section className="bg-gray-900 text-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          Mnemonic and addresses generator
          </h1>
        </div>
        {/* First Card: Generate Mnemonic */}
        <Card className="mb-8 w-full md:w-4/5 md:mx-auto bg-gray-800 border border-gray-700 shadow-lg rounded-lg p-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-orange-500">
            Generate mnemonic
            </CardTitle>
            <p className="text-xs text-gray-500">
              Generate a new BIP39 mnemonic phrase and seed. <br />
              (Use at your own risk) <br />
              If you disclose the information produced on this page to others,
              they could take your assets.
            </p>
          </CardHeader>
          <CardContent className="py-3">
            <Button
              onClick={handleGenerateMnemonic}
              className="btn-primary ml-2 text-xl font-semibold text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  Generating
                </>
              ) : (
                "Generate Mnemonic"
              )}
            </Button>
            {newMnemonic && newSeed && (
              <div className="mt-4 space-y-4">
                <div>
                  <Label className="text-sm text-gray-200">Mnemonic</Label>
                  <div className="relative">
                    <textarea
                      value={newMnemonic}
                      readOnly
                      className="mt-1 w-full text-sm p-2 border border-gray-300 rounded-md bg-gray-800 text-white pr-16 min-h-[80px]"
                    />
                    <Button
                      onClick={() => handleCopy(newMnemonic)}
                      className="absolute top-1 right-1 p-1 bg-gray-700 hover:bg-gray-600"
                      size="sm"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => showQr(newMnemonic)}
                      className="absolute top-1 right-10 p-1 bg-gray-700 hover:bg-gray-600"
                      size="sm"
                    >
                      QR
                    </Button>
                  </div>
                  <Button
                    onClick={() => setAddressMnemonic(newMnemonic)}
                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white ml-2 text-xl font-semibold"
                  >
                    Use this mnemonic for address generation
                  </Button>
                </div>
                <div>
                  <Label className="text-sm text-gray-200">Seed</Label>
                  <div className="relative">
                    <textarea
                      value={newSeed}
                      readOnly
                      className="mt-1 w-full text-sm p-2 border border-gray-300 rounded-md bg-gray-800 text-white pr-16 min-h-[80px]"
                    />
                    <Button
                      onClick={() => handleCopy(newSeed)}
                      className="absolute top-1 right-1 p-1 bg-gray-700 hover:bg-gray-600"
                      size="sm"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => showQr(newSeed)}
                      className="absolute top-1 right-10 p-1 bg-gray-700 hover:bg-gray-600"
                      size="sm"
                    >
                      QR
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {error && !newMnemonic && (
              <p className="text-red-500 text-xs mt-3">{error}</p>
            )}
          </CardContent>
        </Card>
        {/* Second Card: Generate Addresses */}
        <Card className="mb-8 w-full md:w-4/5 md:mx-auto bg-gray-800 border border-gray-700 shadow-lg rounded-lg p-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-orange-500">
              Generate {displayNames[addressType]} addresses
            </CardTitle>
            <p className="text-xs text-gray-500">
              Generate Bitcoin addresses from a mnemonic using the selected BIP
              standard. <br />
              (Use at your own risk)
            </p>
          </CardHeader>
          <CardContent className="py-3">
            <form onSubmit={handleGenerateAddresses} className="space-y-4">
              <div>
                <Label htmlFor="mnemonic" className="text-sm text-gray-200">
                  Mnemonic
                </Label>
                <div className="relative">
                  <textarea
                    id="mnemonic"
                    value={addressMnemonic}
                    onChange={(e) => setAddressMnemonic(e.target.value)}
                    className="mt-1 w-full text-sm p-2 border border-gray-300 rounded-md bg-gray-800 text-white pr-16 min-h-[80px]"
                    placeholder="Enter your mnemonic phrase"
                  />
                  <Button
                    onClick={() => handleCopy(addressMnemonic)}
                    className="absolute top-1 right-1 p-1 bg-gray-700 hover:bg-gray-600"
                    size="sm"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => showQr(addressMnemonic)}
                    className="absolute top-1 right-10 p-1 bg-gray-700 hover:bg-gray-600"
                    size="sm"
                  >
                    QR
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="passphrase" className="text-sm text-gray-200">
                  Passphrase (optional)
                </Label>
                <input
                  id="passphrase"
                  type="text"
                  value={addressPassphrase}
                  onChange={(e) => setAddressPassphrase(e.target.value)}
                  className="mt-1 w-full text-sm p-2 border border-gray-300 rounded-md bg-gray-800 text-white"
                  placeholder="Enter passphrase"
                />
              </div>
              <div>
                <Label htmlFor="addressType" className="text-sm text-gray-200">
                  Address Type{" "}
                  <p className="text-xs text-gray-500">
                    Default: BIP84 (Native SegWit) for its efficiency and broad
                    support in 2025.
                  </p>
                </Label>
                <select
                  id="addressType"
                  value={addressType}
                  onChange={(e) => setAddressType(e.target.value)}
                  className="mt-1 w-full text-sm p-2 border border-gray-300 rounded-md bg-gray-800 text-white"
                >
                  <option value="bip32">
                    BIP32: Hierarchical Deterministic (HD) wallets (e.g.,
                    "1..."). Wallets: Electrum, Bitcoin Core, MultiBit. Not
                    recommended (foundational, lacks specificity).
                  </option>
                  <option value="bip44">
                    BIP44: Legacy HD (P2PKH, "1..."). Wallets: Ledger, Trezor,
                    Electrum, Mycelium, Exodus. Good compatibility, but higher
                    fees.
                  </option>
                  <option value="bip49">
                    BIP49: Wrapped SegWit (P2SH-P2WPKH, "3..."). Wallets:
                    Ledger, Trezor, Samourai, BlueWallet, Blockstream Green.
                    Transitional choice, less efficient than native SegWit.
                  </option>
                  <option value="bip84">
                    BIP84: Native SegWit (P2WPKH, "bc1..."). Wallets: Ledger,
                    Trezor, Samourai, BlueWallet, Blockstream Green, Electrum.
                    Recommended Default: Best balance of fees, support, and
                    modernity.
                  </option>
                  <option value="bip86">
                    BIP86: Taproot (P2TR, "bc1p..."). Wallets: Ledger, Trezor
                    Model T, Bitcoin Core, Sparrow, BlueWallet. Offers superior
                    privacy and scripting potential. Future-proof, but adoption
                    still growing.
                  </option>
                  {/* <option value="bip141-wrapped">
                    BIP141 Wrapped SegWit (via BIP49): Same as BIP49 ("3...").
                    Wallets: Ledger, Trezor, Samourai, BlueWallet, Blockstream
                    Green. Solid compatibility, not optimal.
                  </option>
                  <option value="bip141-native">
                    BIP141 Native SegWit (via BIP84): Same as BIP84 ("bc1...").
                    Wallets: Ledger, Trezor, Samourai, BlueWallet, Blockstream
                    Green, Electrum. Recommended Default: Efficient and widely
                    adopted.
                  </option>
                */}
                </select>
              </div>
              <div>
                <Label htmlFor="numAddresses" className="text-sm text-gray-200">
                  Number of Addresses (1-10)
                </Label>
                <input
                  id="numAddresses"
                  type="number"
                  min="1"
                  max="10"
                  value={addressNumAddresses}
                  onChange={(e) =>
                    setAddressNumAddresses(Number(e.target.value))
                  }
                  className="mt-1 w-full text-sm p-2 border border-gray-300 rounded-md bg-gray-800 text-white"
                />
              </div>
              <div className="flex items-center">
                <input
                  id="includePrivateKeys"
                  type="checkbox"
                  checked={addressIncludePrivateKeys}
                  onChange={(e) =>
                    setAddressIncludePrivateKeys(e.target.checked)
                  }
                  className="mr-2"
                />
                <Label
                  htmlFor="includePrivateKeys"
                  className="text-sm text-gray-200"
                >
                  Include Private Keys
                </Label>
              </div>
              <Button
                type="submit"
                className="btn-primary ml-2 text-xl font-semibold text-white"
                disabled={isLoadingAddresses}
              >
                {isLoadingAddresses ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    Generating
                  </>
                ) : (
                  "Generate Addresses"
                )}
              </Button>
            </form>
            {errorAddresses && (
              <p className="text-red-500 text-xs mt-3">{errorAddresses}</p>
            )}
            {generatedAddresses && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-white">
                  Generated Addresses
                </h3>
                <ul className="mt-2 space-y-2">
                  {generatedAddresses.map((addr, index) => (
                    <li key={index} className="text-xs text-gray-200">
                      {/* Derivation Path */}
                      <div className="flex items-center justify-between">
                        <span>
                          <strong>Derivation Path:</strong>{" "}
                          {addr.derivation_path}
                        </span>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleCopy(addr.derivation_path)}
                            className="p-1 bg-gray-700 hover:bg-gray-600"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => showQr(addr.derivation_path)}
                            className="p-1 bg-gray-700 hover:bg-gray-600"
                          >
                            QR
                          </Button>
                        </div>
                      </div>
                      {/* Address */}
                      <div className="flex items-center justify-between">
                        <span>
                          <strong>Address:</strong> {addr.address}
                        </span>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleCopy(addr.address)}
                            className="p-1 bg-gray-700 hover:bg-gray-600"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => showQr(addr.address)}
                            className="p-1 bg-gray-700 hover:bg-gray-600"
                          >
                            QR
                          </Button>
                        </div>
                      </div>
                      {/* Public Key */}
                      <div className="flex items-center justify-between">
                        <span>
                          <strong>Public Key:</strong> {addr.public_key}
                        </span>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleCopy(addr.public_key)}
                            className="p-1 bg-gray-700 hover:bg-gray-600"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => showQr(addr.public_key)}
                            className="p-1 bg-gray-700 hover:bg-gray-600"
                          >
                            QR
                          </Button>
                        </div>
                      </div>

                      {/* Private Key (if available) */}
                      {addr.private_key && (
                        <div className="flex items-center justify-between text-red-500">
                          <span>
                            <strong>Private Key:</strong> {addr.private_key}{" "}
                            (Keep this secret!)
                          </span>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() =>
                                handleCopy(addr.private_key ?? null)
                              }
                              className="p-1 bg-gray-700 hover:bg-gray-600"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => {
                                if (addr.private_key != null) {
                                  showQr(addr.private_key); // TypeScript knows private_key is a string here
                                }
                              }}
                              className="p-1 bg-gray-700 hover:bg-gray-600"
                            >
                              QR
                            </Button>
                          </div>
                        </div>
                      )}
                      {/* wif (if available) */}
                      {addr.wif && (
                        <div className="flex items-center justify-between text-red-500">
                          <span>
                            <strong>WIF(Wallet Import Format):</strong>{" "}
                            {addr.wif} (Keep this secret!)
                          </span>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleCopy(addr.wif ?? null)}
                              className="p-1 bg-gray-700 hover:bg-gray-600"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => {
                                if (addr.wif != null) {
                                  showQr(addr.wif); // TypeScript knows wif is a string here
                                }
                              }}
                              className="p-1 bg-gray-700 hover:bg-gray-600"
                            >
                              QR
                            </Button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Third Card: Address Types */}
        <Card className="mb-8 w-full md:w-4/5 md:mx-auto bg-gray-800 border border-gray-700 shadow-lg rounded-lg p-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-orange-500">
              Address Types
            </CardTitle>
            <p className="text-xs text-gray-500">
              Explanation of each address type, compatible wallets, and default
              recommendation
            </p>
          </CardHeader>
          <CardContent className="py-3">
            <ul className="space-y-4 text-sm">
              {/* <li>
                <strong>BIP32:</strong> Hierarchical Deterministic (HD) wallets
                (e.g., "1...").
                <br />
                Wallets: Electrum, Bitcoin Core, MultiBit.
                <br />
                Not recommended (foundational, lacks specificity).
              </li> */}
              <li>
                <strong>BIP44:</strong> Legacy HD (P2PKH, "1...").
                <br />
                Wallets: Ledger, Trezor, Electrum, Mycelium, Exodus.
                <br />
                Good compatibility, but higher fees.
              </li>
              <li>
                <strong>BIP49:</strong> Wrapped SegWit (P2SH-P2WPKH, "3...").
                <br />
                Wallets: Ledger, Trezor, Samourai, BlueWallet, Blockstream
                Green.
                <br />
                Transitional choice, less efficient than native SegWit.
              </li>
              <li>
                <strong>BIP84:</strong> Native SegWit (P2WPKH, "bc1...").
                <br />
                Wallets: Ledger, Trezor, Samourai, BlueWallet, Blockstream
                Green, Electrum.
                <br />
                <strong>Recommended Default:</strong> Best balance of fees,
                support, and modernity.
              </li>
              <li>
                <strong>BIP86:</strong> Taproot (P2TR, "bc1p...").
                <br />
                Wallets: Ledger, Trezor Model T, Bitcoin Core, Sparrow,
                BlueWallet. Offers superior privacy and scripting potential.
                <br />
                Future-proof, but adoption still growing.
              </li>
              {/* <li>
                <strong>BIP141 Wrapped SegWit (via BIP49):</strong> Same as
                BIP49 ("3...").
                <br />
                Wallets: Ledger, Trezor, Samourai, BlueWallet, Blockstream
                Green.
                <br />
                Solid compatibility, not optimal.
              </li>
              <li>
                <strong>BIP141 Native SegWit (via BIP84):</strong> Same as BIP84
                ("bc1...").
                <br />
                Wallets: Ledger, Trezor, Samourai, BlueWallet, Blockstream
                Green, Electrum.
                <br />
                <strong>Recommended Default:</strong> Efficient and widely
                adopted.
              </li> */}
            </ul>
          </CardContent>
        </Card>
        {/* QR Code Modal */}
        {qrContent && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
            onClick={hideQr}
          >
            <div className="bg-white p-4 rounded">
              <QRCodeCanvas value={qrContent} size={256} level="H" />
            </div>
            <button
              className="absolute top-4 right-4 text-white text-lg"
              onClick={hideQr}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
