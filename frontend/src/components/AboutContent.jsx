import React from "react";
import { motion } from "framer-motion";

export default function AboutContent() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="text-white"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-6">
        About <span className="text-red-500">Benzamods</span>
      </h2>
      <p className="mb-4 leading-relaxed">
        At <span className="font-semibold text-white">Benzamods</span>, we specialize in 
        transforming cars and bikes into something extraordinary. From 
        performance modifications and premium paintwork to stylish 
        accessories, we bring your dream ride to life.
      </p>
      <p className="mb-6 leading-relaxed">
        Our expert team ensures top-quality craftsmanship, modern 
        technology, and attention to detail in every service we deliver. 
        Whether it’s boosting performance or enhancing aesthetics, 
        we’ve got you covered.
      </p>
      <a
        href="/services"
        className="inline-block bg-red-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-red-600 transition"
      >
        Explore Our Services
      </a>
    </motion.div>
  );
}
