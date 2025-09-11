import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function HeroContent() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="relative z-10 max-w-3xl px-6 text-center"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
        Benzamods <span className="text-red-500">Upgrade Your Ride</span>
      </h1>
      <p className="mt-6 text-lg md:text-xl text-gray-200">
        Premium modifications and accessories for your Cars & Bikes 🚗🏍️
      </p>

      <div className="mt-8 flex justify-center gap-4">
        
        <motion.button
          onClick={() => navigate("/services")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-full bg-red-500 text-white font-semibold shadow-lg hover:bg-red-600 transition"
        >
          Explore Services
        </motion.button>
      </div>
    </motion.div>
  );
}
