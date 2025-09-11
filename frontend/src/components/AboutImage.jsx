import React from "react";
import { motion } from "framer-motion";

export default function AboutImage({ src, alt }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="overflow-hidden rounded-2xl shadow-lg"
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover hover:scale-105 transition duration-500"
      />
    </motion.div>
  );
}
