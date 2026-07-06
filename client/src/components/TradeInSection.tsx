"use client";

import { motion } from "framer-motion";

export default function TradeInSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gradient-to-br from-mega-blue to-mega-blue-dark px-6 py-16 text-center text-white md:py-24"
    >
      <h2 className="mb-4 text-3xl font-bold font-oswald md:text-4xl">
        TRADE IN YOUR VEHICLE
      </h2>
      <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-white/80 font-inter">
        Get top dollar for your trade-in. We make the process fast, fair, and
        hassle-free. Call us today for a quote.
      </p>
      <motion.a
        href="tel:+12629955680"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-block rounded-full bg-white px-8 py-3 text-base font-bold text-mega-blue shadow-lg transition-colors hover:bg-gray-100 font-oswald"
      >
        CALL (262) 995-5680
      </motion.a>
    </motion.section>
  );
}
