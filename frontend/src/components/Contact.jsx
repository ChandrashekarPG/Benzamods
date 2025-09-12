import React, { useState } from "react";
import api from "./api";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";
import { FaWhatsapp } from "react-icons/fa";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/contact", form);
      setSuccess(res.data.message);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.log(err);
    }
  };

  const workshopPosition = [12.9716, 77.5946];

  return (
    <section className="w-full bg-gray-900 text-white py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl md:text-6xl font-extrabold text-center mb-12 bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
          Get in Touch
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-gray-800 shadow-2xl rounded-2xl p-8 hover:shadow-red-700/40 transition duration-300"
          >
            <h3 className="text-2xl font-semibold mb-6 text-red-400">Contact Form</h3>
            {success && <p className="mb-4 text-green-500 font-medium">{success}</p>}
            <form onSubmit={handleSubmit} className="space-y-5">
              {["name", "email", "phone"].map((field) => (
                <div key={field} className="relative">
                  <input
                    type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    placeholder=" "
                    required={field !== "phone"}
                    className="peer w-full p-4 border border-red-500 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-gray-900 text-white"
                  />
                  <label className="absolute left-4 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-red-400 peer-focus:text-sm">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                </div>
              ))}
              <div className="relative">
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder=" "
                  required
                  className="peer w-full p-4 border border-red-500 rounded-lg focus:ring-2 focus:ring-red-500 outline-none h-36 resize-none bg-gray-900 text-white"
                />
                <label className="absolute left-4 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-red-400 peer-focus:text-sm">
                  Message
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-3 rounded-full font-semibold hover:bg-red-700 transition duration-300 shadow-lg hover:shadow-red-700/50"
              >
                Send Message
              </button>
            </form>
          </motion.div>

          {/* Map + Workshop Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="bg-gray-800 shadow-2xl rounded-2xl overflow-hidden hover:shadow-red-700/40 transition duration-300 transform hover:scale-[1.02]">
              <MapContainer center={workshopPosition} zoom={15} style={{ height: "320px", width: "100%" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <Marker position={workshopPosition}>
                  <Popup>
                    <span className="font-semibold text-red-500">Workshop Location</span>
                    <br /> 123 Car Street, Bangalore
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

            <div className="bg-gray-800 shadow-2xl rounded-2xl p-6 hover:shadow-red-700/40 transition duration-300">
              <h3 className="text-2xl font-semibold mb-4 text-red-400">Benzamods Details</h3>
              <p className="mb-2 text-gray-300">
                <span className="font-semibold text-red-400">Address:</span> 123 Car Street, Bangalore
              </p>
              <p className="mb-4 text-gray-300">
                <span className="font-semibold text-red-400">Timings:</span> Mon-Sat, 10:00 AM - 7:00 PM
              </p>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-green-600 text-white px-5 py-3 rounded-full font-semibold hover:bg-green-700 transition duration-300 shadow-lg hover:shadow-green-500/50 animate-pulse"
              >
                <FaWhatsapp size={22} /> Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
