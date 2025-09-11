import React from "react";
import { motion } from "framer-motion";

export default function ClientReview({ review }) {
  return (
    <motion.div
      key={review.name}
      className="text-center px-6"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.6 }}
    >
      <p className="text-lg italic mb-4 text-gray-300">“{review.review}”</p>
      
      <h3 className="text-xl font-semibold text-red-300">{review.name}</h3>

      {review.rating && (
        <p className="text-yellow-400 text-sm mt-2">
          {"⭐".repeat(review.rating)} ({review.rating}/5)
        </p>
      )}
    </motion.div>
  );
}
