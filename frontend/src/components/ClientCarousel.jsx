import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import ClientReview from "./ClientReview";

export default function ClientCarousel() {
  const [reviews, setReviews] = useState([]);
  const [index, setIndex] = useState(0);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/portfolios");
        const clientReviews = res.data
          .filter((p) => p.clientReview)
          .map((p) => ({
            name: p.clientReview.name,
            review: p.clientReview.review,
            rating: p.clientReview.rating,
          }));
        setReviews(clientReviews);
      } catch (err) {
        console.error("Failed to fetch client reviews", err);
      }
    };
    fetchReviews();
  }, []);

  // Auto rotate
  useEffect(() => {
    if (reviews.length === 0) return;
    const timer = setInterval(
      () => setIndex((prev) => (prev + 1) % reviews.length),
      5000
    );
    return () => clearInterval(timer);
  }, [reviews]);

  if (reviews.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black text-white">
        <h2 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
          What Our Clients Say
        </h2>
        <p className="text-center text-gray-400">No reviews yet</p>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg"
      >
        What Our Clients Say
      </motion.h2>

      {/* Review Carousel */}
      <div className="relative w-full max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
            className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/10"
          >
            <ClientReview review={reviews[index]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <motion.div
        key={index}
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 5, ease: "linear" }}
        className="mt-10 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-md w-full max-w-xs mx-auto"
      ></motion.div>
    </section>
  );
}
