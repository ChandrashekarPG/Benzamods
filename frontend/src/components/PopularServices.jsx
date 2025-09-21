// src/components/PopularServices.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";
import { fetchServices } from "./servicesApi";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

export default function PopularServices() {
  const [services, setServices] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    const getServices = async () => {
      try {
        const data = await fetchServices();
        setServices(data);
      } catch (err) {
        console.error(err);
      }
    };
    getServices();
  }, []);

  const handleOpen = (index) => setSelectedIndex(index);
  const handleClose = () => setSelectedIndex(null);

  const prevService = () =>
    setSelectedIndex((prev) => (prev === 0 ? services.length - 1 : prev - 1));
  const nextService = () =>
    setSelectedIndex((prev) => (prev === services.length - 1 ? 0 : prev + 1));

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white py-16 px-6">
      <Helmet>
        <title>Popular Car & Bike Services | BenzaMods</title>
        <meta
          name="description"
          content="Explore BenzaMods' popular services including car modifications, bike tuning, detailing, performance upgrades, and custom garage solutions."
        />
        <meta
          name="keywords"
          content="car modification services, bike tuning, car detailing, custom garages, BenzaMods services, performance upgrades, workshops"
        />
        <meta property="og:title" content="Popular Car & Bike Services | BenzaMods" />
        <meta
          property="og:description"
          content="Discover BenzaMods' most popular bike and car services trusted by owners, dealerships, and garages."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/services" />
        <meta property="og:site_name" content="BenzaMods" />
      </Helmet>

      {/* 🔥 Candlelight Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-ping" />
      </div>

      <h1 className="relative text-5xl font-extrabold text-center mb-14 z-10">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-400">
          Popular Services
        </span>
      </h1>

      {/* Services Grid */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto z-10">
        {services.map((service, i) => (
          <motion.div
            key={service._id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.05, rotate: 1 }}
            className="bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden hover:shadow-red-500/40 transition-shadow duration-300 cursor-pointer"
            onClick={() => handleOpen(i)}
          >
            <img
              src={service.image}
              alt={service.name}
              className="h-52 w-full object-cover rounded-t-2xl"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {service.name}
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                {service.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
<AnimatePresence>
  {selectedIndex !== null && (
    <motion.div
      className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative bg-gray-900 rounded-xl p-6 max-w-3xl w-full shadow-2xl">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl z-50"
          onClick={(e) => {
            e.stopPropagation(); // ✅ prevent bubbling
            handleClose();
          }}
        >
          <FaTimes />
        </button>

        {/* Image */}
        <img
          src={services[selectedIndex].image}
          alt={services[selectedIndex].name}
          className="w-full h-96 object-cover rounded-lg mb-4"
        />

        {/* Name + Description */}
        <h2 className="text-3xl font-bold text-yellow-400 mb-3 text-center">
          {services[selectedIndex].name}
        </h2>
        <p className="text-gray-300 text-lg leading-relaxed text-center">
          {services[selectedIndex].description}
        </p>

        {/* Navigation arrows */}
        <div className="absolute inset-y-0 left-3 flex items-center z-40">
          <button
            className="bg-gray-800/70 p-3 rounded-full text-white hover:bg-gray-700"
            onClick={prevService}
          >
            <FaChevronLeft />
          </button>
        </div>
        <div className="absolute inset-y-0 right-3 flex items-center z-40">
          <button
            className="bg-gray-800/70 p-3 rounded-full text-white hover:bg-gray-700"
            onClick={nextService}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>

    </div>
  );
}
