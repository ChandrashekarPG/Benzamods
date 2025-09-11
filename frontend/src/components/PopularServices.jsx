// src/components/PopularServices.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { fetchServices } from "./servicesApi";

export default function PopularServices() {
  const [services, setServices] = useState([]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white py-16 px-6">
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

      <h1 className="text-5xl font-extrabold text-center mb-14">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-400">
          Popular Services
        </span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {services.map((service, i) => (
          <motion.div
            key={service._id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.05, rotate: 1 }}
            className="bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden hover:shadow-red-500/40 transition-shadow duration-300"
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
    </div>
  );
}
