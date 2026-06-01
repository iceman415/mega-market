"use client";

import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <Image
              src="/logotype-mega-market.png"
              alt="MEGA MARKET"
              width={150}
              height={40}
              className="h-auto w-auto mb-4 brightness-0 invert"
              style={{ width: 150, height: "auto" }}
            />
            <p className="font-inter text-gray-400">
              Your trusted source for quality vehicles and auto parts since 2010.
            </p>
          </div>

          <div>
            <h4 className="font-oswald text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="font-inter text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/?section=inventory" className="font-inter text-gray-400 hover:text-white transition-colors">
                  Inventory
                </Link>
              </li>
              <li>
                <Link href="/?section=parts" className="font-inter text-gray-400 hover:text-white transition-colors">
                  Parts
                </Link>
              </li>
              <li>
                <Link href="/trade-in" className="font-inter text-gray-400 hover:text-white transition-colors">
                  Trade Your Car
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-oswald text-lg mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="font-inter text-gray-400">
                123 Auto Drive, Car City, CC 12345
              </li>
              <li>
                <a href="tel:+1234567890" className="font-inter text-gray-400 hover:text-white transition-colors">
                  (123) 456-7890
                </a>
              </li>
              <li>
                <a href="mailto:info@megamarket.com" className="font-inter text-gray-400 hover:text-white transition-colors">
                  info@megamarket.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="font-inter text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} MEGA MARKET. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}