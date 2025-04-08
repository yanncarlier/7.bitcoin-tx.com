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
                Accept cryptocurrency payments with ease{" "}
                <span className="text-orange-500">(Beta)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center sm:mt-5 sm:text-2xl lg:text-xl xl:text-2xl">
              0% Fees | subscripton plans | No Third Parties | Open-Source
              technology <br />
              Welcome to Bitcoin-tx, a secure, private, and self managed
              cryptocurrency payment processor designed to help you start
              accepting payments instantly. Whether you’re running a store,
              tipping online, invoicing clients, or crowdfunding a cause, we’ve
              got you covered, all with no middleman.
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <Card className="py-4">
            <CardHeader className="text-center text-1xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
              <CardTitle className="text-2xl font-bold text-orange-500">
                Powerful Features, Right at Your Fingertips
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center sm:mt-5 sm:text-2xl lg:text-xl xl:text-2xl">
              Invoicing & Accounting: Simplified billing and tracking. <br />
              Native Wallet Management: Securely manage Bitcoin and Liquid
              wallets. <br />
              Supported Wallets: (hot and hard) <br />
              Bitcoin (BTC) <br />
              Liquid Tether (USDT) <br />
              Liquid CAD (L-CAD) <br />
              Liquid Bitcoin (L-BTC) <br />
              Lightning (BTC)
              <br />
              Payment Options: Invoices, requests, pull payments, payouts, and
              reporting. <br />
              Plugins: Shopify, Point of Sale, Pay Button, Crowdfund.
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <Card className="py-4">
            <CardHeader className="text-center text-1xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
              <CardTitle className="text-2xl font-bold text-orange-500">
                Why Choose Bitcoin-tx?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center sm:mt-5 sm:text-2xl lg:text-xl xl:text-2xl">
              Built-In Tools: Essential features are ready out of the box—start
              fast, no setup hassle. <br />
              Versatile Use Cases: Create a Point-of-Sale app, add a tipping
              button, send global payment links, or launch a crowdfunding
              campaign. <br />
              Self-Hosted or Shared: Flexibility to run it your way—on your
              server or ours. <br /> Automation Ready: Seamless integration with
              our API for hands-free workflows.
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
                Get Started Today
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center sm:mt-5 sm:text-2xl lg:text-xl xl:text-2xl">
              Join the future of payments with Bitcoin-tx. Accept Bitcoin
              securely, privately, and without fees. Pick your plan and start
              your 7-day free trial now!
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
