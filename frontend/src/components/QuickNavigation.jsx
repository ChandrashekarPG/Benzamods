import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const tiles = [
  {
    to: "/car-mods",
    title: "Shop by Car",
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
  },
  {
    to: "/bike-mods",
    title: "Shop by Bike",
    img: "https://img.goodfon.com/wallpaper/big/6/19/bmw-mototsikl-baik-custom-cafe-racer-r100.webp",
  },
];

const QuickNavigation = () => {
  return (
    <section className="py-16 bg-gray-900">
      <div className="flex flex-wrap justify-center gap-12">
        {tiles.map((tile, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            viewport={{ once: true }}
          >
            <Link to={tile.to} className="block w-80 md:w-96">
              <motion.div
                whileHover={{ scale: 1.07, rotate: 1 }}
                whileTap={{ scale: 0.97 }}
                className="relative text-center border-4 border-red-600 shadow-lg rounded-2xl overflow-hidden bg-gray-800 p-5 cursor-pointer group transition"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 border-4 border-red-600 rounded-2xl opacity-0 group-hover:opacity-100 blur-md transition duration-300"></div>

                {/* Tile Image */}
                <img
                  src={tile.img}
                  alt={tile.title}
                  className="w-full h-56 object-cover rounded-lg shadow-md group-hover:shadow-red-500/50 transition"
                />

                {/* Title */}
                <h2 className="text-2xl font-semibold mt-4 text-white group-hover:text-yellow-400 transition-colors duration-300">
                  {tile.title}
                </h2>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default QuickNavigation;
