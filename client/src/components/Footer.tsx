"use client";

import Image from "next/image";
import Link from "next/link";
import { Shield } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 px-6 py-12 text-gray-300 md:px-12">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <Image
            src="/logotype-mega-market.png"
            alt="MEGA MARKET"
            width={180}
            height={45}
            className="mb-4 h-10 w-auto brightness-0 invert"
          />
          <p className="text-sm leading-relaxed text-gray-400 font-inter">
            Your trusted source for quality vehicles and parts. Serving the
            community with reliable automotive solutions.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-white font-oswald">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm font-inter">
            <li>
              <Link
                href="/"
                className="transition-colors hover:text-white"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="transition-colors hover:text-white"
              >
                Inventory
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="transition-colors hover:text-white"
              >
                Parts
              </Link>
            </li>
            <li>
              <Link
                href="/trade-in"
                className="transition-colors hover:text-white"
              >
                Trade Your Car
              </Link>
            </li>
            <li>
              <Link
                href="/admin/login"
                className="flex items-center gap-1.5 text-gray-400 transition-colors hover:text-white"
              >
                <Shield className="h-3.5 w-3.5" />
                Admin
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-white font-oswald">
            Contact
          </h3>
          <div className="space-y-2 text-sm font-inter">
            <p>
              <a
                href="tel:+12629955680"
                className="transition-colors hover:text-white"
              >
                (262) 995-5680
              </a>
            </p>
            <p>
              <a
                href="mailto:megamarket414@gmail.com"
                className="transition-colors hover:text-white"
              >
                megamarket414@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-800 pt-6 text-center text-xs text-gray-500 font-inter">
        &copy; {currentYear} MEGA MARKET. All rights reserved.
      </div>
    </footer>
  );
}
