"use client";

import Link from "next/link";
import { useState } from "react";

const apiurl = process.env.NEXT_PUBLIC_API_URL

export function NavigationLinks() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    
    <nav className="relative">
      {/* Toggle Button for Mobile */}
      <button
        className="md:hidden p-2 text-gray-200 hover:text-white focus:outline-none"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {/* Hamburger Icon (changes to X when open) */}
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* Navigation Links */}
      
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:flex md:items-center md:space-x-4 absolute md:static top-full left-0 w-full md:w-auto bg-gray-800 md:bg-transparent p-4 md:p-0`}
      > <div className="ml-2 text-xl font-semibold text-white">|</div>
        <a
          className="ml-2 text-xl font-semibold text-orange-500"
          target="_blank"
          rel="noopener noreferrer"
          href={apiurl + '/login'}
        >
          Store
        </a> <div className="ml-2 text-xl font-semibold text-white">|</div>
        <Link
          href="/dashboard"
          className="ml-2 text-xl font-semibold text-orange-500"
        >
          Dashboard
        </Link>
      </div>
    </nav>
  );
}
