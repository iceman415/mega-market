"use client";

import Link from "next/link";
import { Phone, MessageCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Footer } from "@/components";

export default function TradeInPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-mega-blue mb-6"
          >
            <Phone className="h-8 w-8 text-white" />
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-bold font-oswald text-gray-900 mb-4">
            For a quote Provide Year, Make, Model
          </h1>

          <p className="text-lg text-gray-700 font-inter mb-8">
            Call or text us with your vehicle details and we will get you a quote fast.
          </p>

          <p className="text-2xl font-bold text-mega-blue font-oswald mb-8">
            (262) 995-5680
          </p>

          <div className="space-y-4">
            <motion.a
              href="tel:+12629955680"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-3 w-full rounded-full bg-mega-blue px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-mega-blue-dark transition-colors font-oswald"
            >
              <Phone className="h-5 w-5" />
              CALL US
            </motion.a>

            <motion.a
              href="sms:+12629955680"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-3 w-full rounded-full border-2 border-mega-blue px-8 py-4 text-lg font-bold text-mega-blue shadow-lg hover:bg-mega-blue hover:text-white transition-colors font-oswald"
            >
              <MessageCircle className="h-5 w-5" />
              TEXT US
            </motion.a>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-10 text-gray-500 hover:text-mega-blue transition-colors font-inter"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
