"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/Footer";

const PHONE = "+1234567890";
const PHONE_DISPLAY = "(123) 456-7890";

export default function TradeInPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-mega-blue font-oswald"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-oswald text-2xl sm:text-3xl text-gray-900 mb-4">
            For a quote<br />Provide Year, Make, Model
          </h1>

          <a
            href={`tel:${PHONE}`}
            className="font-oswald text-3xl sm:text-4xl font-bold text-mega-blue block mb-10 hover:underline"
          >
            {PHONE_DISPLAY}
          </a>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${PHONE}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-mega-blue text-white px-8 py-4 rounded-full font-oswald text-lg inline-flex items-center justify-center gap-3 hover:bg-mega-blue-dark transition-colors"
              >
                <Phone className="w-5 h-5" />
                CALL US
              </motion.button>
            </a>

            <a href={`sms:${PHONE}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-white text-mega-blue border-2 border-mega-blue px-8 py-4 rounded-full font-oswald text-lg inline-flex items-center justify-center gap-3 hover:bg-mega-blue hover:text-white transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                TEXT US
              </motion.button>
            </a>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
