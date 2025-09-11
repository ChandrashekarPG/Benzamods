import React from "react";
import { motion } from "framer-motion";

export default function GalleryImage({ src, alt }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className="overflow-hidden rounded-2xl shadow-lg"
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
      />
    </motion.div>
  );
}
