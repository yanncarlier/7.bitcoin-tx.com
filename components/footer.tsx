// "use client";
import Link from "next/link";
// import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className=" border-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Bitcoin-tx
            </h3>

            <a
              href="https://www.bitcoin-tx.com/Screenshots/index.html"
              className="text-gray-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              POS SaaS for Stores Screenshots.
            </a>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-200 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-200 hover:text-white"
                >
                  Pricing
                </Link>
              </li>
              {/* <li>
                <Link href="#" className="text-gray-200 hover:text-white">
                  About Us
                </Link>
              </li> */}
              {/* <li>
                <Link href="#" className="text-gray-200 hover:text-white">
                  Contact
                </Link>
              </li> */}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  target="_blank"
                  href="/terms"
                  className="text-gray-200 hover:text-white"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  target="_blank"
                  href="/privacy"
                  className="text-gray-200 hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              {/* <li>
                <Link href="#" className="text-gray-200 hover:text-white">
                  Cookie Policy
                </Link>
              </li> */}
            </ul>
          </div>
          {/* <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-200 hover:text-white">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-200 hover:text-white">
                <Twitter className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-200 hover:text-white">
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-200 hover:text-white">
                <Linkedin className="h-6 w-6" />
              </Link>
            </div>
          </div> */}
        </div>
      </div>
      <div className=" border-gray-400 py-4 text-center text-white">
        <p className="">
          &copy; {new Date().getFullYear()} Bitcoin-tx. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
