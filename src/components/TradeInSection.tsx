"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";

export function TradeInSection() {
  return (
    <section id="trade-in" className="py-16 bg-gradient-to-br from-mega-blue to-mega-blue-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="font-oswald text-3xl md:text-4xl mb-6">
            Did you know you can get credit for your vehicle even if it&apos;s not working?
          </h2>
          <p className="font-inter text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            We accept all kinds of vehicles in any condition. Get a fair quote today!
          </p>

          <a href="tel:(262) 995-5680">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-mega-blue px-8 py-4 rounded-full font-oswald text-lg inline-flex items-center gap-3 hover:bg-gray-100 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Contact us for a quote
            </motion.button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
