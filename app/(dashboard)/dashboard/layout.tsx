"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Users,
  Settings,
  Shield,
  Activity,
  Menu,
  Home,
  Star,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    // { href: "/", icon: Home, label: "Home" },
    // { href: "/dashboard/addresses", icon: Settings, label: "Addresses" },
    // { href: "/dashboard/stores", icon: Star, label: "Stores" },
    // { href: "/dashboard/point-of-sale", icon: Star, label: "Point of sale" },
    // { href: "/dashboard/crypto-charts", icon: Star, label: "Crypto charts" },
    // { href: "/pricing", icon: Star, label: "Choose Plan" },

    // {
    //   href: "https://btcpay.bitcoin-tx.com/login?ReturnUrl=%2Fs",
    //   target: "_blank",
    //   icon: Settings,
    //   label: "Store Sign In",
    // },

    //   <a
    //   className="ml-2 text-xl font-semibold text-white"
    //   target="_blank"
    //   rel="noopener noreferrer"
    //   href="https://btcpay.bitcoin-tx.com/login?ReturnUrl=%2F"
    // >
    //   Store Sign In
    // </a>

    // { href: "/dashboard/custody", icon: Settings, label: "Custody" },
    { href: "/dashboard", icon: Users, label: "Dashboard" },

    { href: "/dashboard/general", icon: Settings, label: "General" },

    { href: "/dashboard/security", icon: Shield, label: "Security" },
    { href: "/dashboard/activity", icon: Activity, label: "Activity" },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100dvh-68px)] max-w-7xl mx-auto w-full">
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between border-b border-gray-200 p-4 text-white">
        <div className="flex items-center">
          <span className="font-medium">Settings</span>
        </div>
        <Button
          className="-mr-3 btn-primary "
          variant="ghost"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden h-full">
        {/* Sidebar */}
        <aside
          className={`w-68 lg:bg-gray-50 border-r border-gray-200 lg:block body-custom ${
            isSidebarOpen ? "block" : "hidden"
          } lg:relative absolute inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="h-full overflow-y-auto overflow-x-hidden p-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} passHref>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={`shadow-none my-1 w-full justify-start btn-primary ml-2 text-xl font-semibold text-white ${
                    pathname === item.href ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-0 lg:p-4">{children}</main>
      </div>
    </div>
  );
}
