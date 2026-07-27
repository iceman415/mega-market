"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Phone, MessageCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Footer } from "@/components";

function ContactContent() {
  const searchParams = useSearchParams();
  const item = searchParams.get("item");

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col relative">
      {/* Fixed Back button at top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-50/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-mega-blue transition-colors font-inter group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Centered content */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-8 py-20 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm sm:max-w-md"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 18, delay: 0.1 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-mega-blue mb-5"
          >
            <Phone className="h-7 w-7 text-white" />
          </motion.div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold font-oswald text-gray-900 mb-2">
            Contact Us
          </h1>

          {item && (
            <p className="text-sm md:text-base text-gray-500 font-inter mb-4">
              You are inquiring about this {item}
            </p>
          )}

          {/* Text */}
          <p className="text-base md:text-lg text-gray-700 font-inter leading-relaxed mb-8">
            Sell, trade or get a credit for your wrecked or junk car.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <motion.a
              href="tel:+12629955680"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2.5 w-full sm:flex-1 rounded-full bg-mega-blue px-6 py-4 text-base md:text-lg font-bold text-white shadow-md hover:bg-mega-blue-dark transition-colors font-oswald"
            >
              <Phone className="h-5 w-5" />
              CALL (262) 995-5680
            </motion.a>

            <motion.a
              href="sms:+12629955680"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2.5 w-full sm:flex-1 rounded-full border-2 border-mega-blue px-6 py-4 text-base md:text-lg font-bold text-mega-blue hover:bg-mega-blue hover:text-white transition-colors font-oswald"
            >
              <MessageCircle className="h-5 w-5" />
              TEXT (262) 995-5680
            </motion.a>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh flex items-center justify-center bg-gray-50">
          <div className="w-10 h-10 border-4 border-mega-blue border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ContactContent />
    </Suspense>
  );
}
