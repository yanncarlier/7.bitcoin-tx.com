import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { UserProvider } from "@/lib/auth";
import { getUser } from "@/lib/db/queries";
import { Analytics } from "@vercel/analytics/react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "BITCOIN-TX",
  description: "Bitcoin tools",
};

export const viewport: Viewport = {
  maximumScale: 1,
};

const manrope = Manrope({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userPromise = getUser();

  return (
    <html lang="en" className={`  ${manrope.className}`}>
      <body className="body-custom">
        <UserProvider userPromise={userPromise}>
          <Header />
          {children}
          <Footer />
        </UserProvider>
        <Analytics />
      </body>
    </html>
  );
}
