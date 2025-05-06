import { checkoutAction } from "@/lib/payments/actions";
import { Check } from "lucide-react";
import { getStripePrices, getStripeProducts } from "@/lib/payments/stripe";
import { SubmitButton } from "./submit-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function Pricing() {
  const [prices, products] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
  ]);

  const basePlan = products.find((product) => product.name === "Base");
  const plusPlan = products.find((product) => product.name === "Plus");

  const basePrice = prices.find((price) => price.productId === basePlan?.id);
  const plusPrice = prices.find((price) => price.productId === plusPlan?.id);

  return (
    <section className="bg-gray-900 text-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Choose the Plan That’s Right for You
          </h1>
          <p className="text-lg sm:text-xl text-gray-300">
            Start accepting cryptocurrency payments with our flexible plans.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <PricingCard
            name={basePlan?.name || "Base"}
            price={basePrice?.unitAmount || 800}
            interval={basePrice?.interval || "month"}
            trialDays={basePrice?.trialPeriodDays || 7}
            features={[
              "1 (Hot wallet) Store ",
              "Email Support",
              "1 Bitcoin Wallet (BTC)",
              "1 Liquid Tether Wallet (USDT)",
              "1 Liquid CAD Wallet (L-CAD)",
              "1 Liquid Bitcoin Wallet (L-BTC)",
              "1 Lightning Wallet Integration (BTC)",
            ]}
            priceId={basePrice?.id}
          />
          <PricingCard
            name={plusPlan?.name || "Plus"}
            price={plusPrice?.unitAmount || 1200}
            interval={plusPrice?.interval || "month"}
            trialDays={plusPrice?.trialPeriodDays || 7}
            features={[
              "1 (Hot wallet) Store",
              "1 (Hard wallet) Store (optional service management, extra fee)",
              "Priority Support",
              "2 Store",
              "2 Bitcoin Wallet (BTC)",
              "2 Liquid Tether Wallet (USDT)",
              "2 Liquid CAD Wallet (L-CAD)",
              "2 Liquid Bitcoin Wallet (L-BTC)",
              "1 Lightning Wallet Integration (BTC Lightning)",
              "1 Point of Sales",
            ]}
            priceId={plusPrice?.id}
          />
        </div>
      </div>
    </section>
  );
}

function PricingCard({
  name,
  price,
  interval,
  trialDays,
  features,
  priceId,
}: {
  name: string;
  price: number;
  interval: string;
  trialDays: number;
  features: string[];
  priceId?: string;
}) {
  return (
    <Card className="bg-gray-800 border border-gray-700 shadow-lg rounded-lg p-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-orange-500">
          {name}
        </CardTitle>
        <CardDescription className="text-gray-400">
          with {trialDays} day free trial
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold text-white mb-4">
          ${price / 100}{" "}
          <span className="text-xl font-normal text-gray-400">
            per {interval}
          </span>
        </p>
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
              <span className="text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <form action={checkoutAction} className="w-full">
          <input type="hidden" name="priceId" value={priceId} />
          <SubmitButton />
        </form>
      </CardFooter>
    </Card>
  );
}
