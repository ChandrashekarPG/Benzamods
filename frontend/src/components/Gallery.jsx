import React from "react";
import { motion } from "framer-motion";
import GalleryImage from "./GalleryImage";

const images = [
  "https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg",
  "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
  "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg",
  "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
  "https://www.watchdavid.com/wp-content/uploads/2018/08/bmw-motorrad.jpg",
  "https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg",
];

export default function Gallery() {
  return (
    <section id="gallery" className="py-24 bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white w-full">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl md:text-6xl font-extrabold text-center mb-16 drop-shadow-lg bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
          Our <span className="text-white">Gallery</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {images.map((src, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 80, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.08, rotateX: 5, rotateY: 5 }}
              className="relative overflow-hidden rounded-3xl border-2 border-red-600 shadow-2xl shadow-red-700/40 cursor-pointer group"
            >
              <GalleryImage
                src={src}
                alt={`Gallery image ${idx + 1}`}
                className="w-full h-72 md:h-80 lg:h-96 object-cover transition-transform duration-500 ease-in-out transform group-hover:scale-105 group-hover:brightness-110"
              />
              {/* Glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <p className="text-white font-bold text-lg drop-shadow-lg">
                  Photo {idx + 1}
                </p>
                <div className="mt-2 flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse delay-150"></span>
                  <span className="w-3 h-3 rounded-full bg-pink-500 animate-pulse delay-300"></span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
