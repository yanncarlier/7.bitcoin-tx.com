import { Button } from "@/components/ui/button";
import { ArrowRight, CreditCard, Database } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Price from "@/components/pricing";

export default function Hero() {
  return (
    <main>
      <section className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <Card className="py-4">
            <CardHeader className="text-center text-1xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
              <CardTitle className="text-2xl font-bold text-orange-500">
                Bitcoin-tx: Simplified POS SaaS for Stores{" "}
                <span className="text-orange-500">(Beta)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center sm:mt-5 sm:text-2xl lg:text-xl xl:text-2xl">
              Bitcoin-tx is a Point-of-Sale (POS) Software-as-a-Service (SaaS)
              designed for stores and businesses to easily accept cryptocurrency
              payments. It’s secure, private, and self-managed, allowing you to
              process payments without intermediaries.
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <Card className="py-4">
            <CardHeader className="text-center text-1xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
              <CardTitle className="text-2xl font-bold text-orange-500">
                Key Features:
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center sm:mt-5 sm:text-2xl lg:text-xl xl:text-2xl">
              Fees: 0% transaction fees on subscription plans. Store owners can
              charge fees on store transactions. <br />
              Security: Create stores using online private keys for convenient
              management or offline keys for complete control.
              <br />
              Supported Cryptocurrencies: <br />
              Bitcoin (BTC), <br />
              Liquid Tether (USDT),
              <br />
              Liquid CAD (L-CAD), <br />
              Liquid Bitcoin (L-BTC), and <br />
              Lightning (BTC).
              <br /> Invoicing & Accounting: Easy billing and payment tracking.
              <br /> Wallet Management: Securely manage hot and hardware
              wallets. <br /> Payment Tools: Create invoices, payment requests,
              pull payments, payouts, and reports. <br />
              Plugins: Integrate with Shopify, POS systems, pay buttons,
              crowdfunding campaigns and more. <br />
              Filosophy: Transparent and customizable technology.
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <Card className="py-4">
            <CardHeader className="text-center text-1xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
              <CardTitle className="text-2xl font-bold text-orange-500">
                Why Bitcoin-tx?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center sm:mt-5 sm:text-2xl lg:text-xl xl:text-2xl">
              Ready-to-Use: Start accepting payments instantly with built-in
              tools.
              <br /> Versatile: Use for in-store POS, online tipping, global
              payment links, or crowdfunding. <br /> Flexible Hosting: Run on
              your server or use Bitcoin-tx’s shared hosting. <br /> API
              Integration: Automate workflows for efficiency.
            </CardContent>
          </Card>
        </div>
      </section>
      <section>
        <Price />
      </section>
      <section className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <Card className="py-4">
            <CardHeader className="text-center text-1xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
              <CardTitle className="text-2xl font-bold text-orange-500">
                Get Started
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center sm:mt-5 sm:text-2xl lg:text-xl xl:text-2xl">
              Accept crypto payments securely with Bitcoin-tx. Choose a plan and
              try it free for 7 days!
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
