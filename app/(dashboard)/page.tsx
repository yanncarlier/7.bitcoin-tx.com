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
import Hero from "@/components/hero";
import Price from "@/components/pricing";
// import { CryptoChart } from "@/components/crypto-chart";

export default function HomePage() {
  return (
    <main>
      <section>
        <Hero />
      </section>
      {/* <section>
        <Price />
      </section> */}
    </main>
  );
}
