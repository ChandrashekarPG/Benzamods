// src/components/EnquiryForm.jsx
import React, { useState } from "react";
import axios from "axios";

export default function EnquiryForm({ productId, user, onRequireLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      onRequireLogin();
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/enquiries",
        { ...form, productId, userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Enquiry submitted successfully!");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to submit enquiry");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 border border-gray-700 rounded-lg shadow-lg bg-gray-800 text-gray-100 max-w-md mx-auto"
    >
      <h3 className="text-xl font-semibold mb-4 text-blue-400">Enquiry Form</h3>

      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={form.name}
        onChange={handleChange}
        className="w-full p-2 mb-3 rounded bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Your Email"
        value={form.email}
        onChange={handleChange}
        className="w-full p-2 mb-3 rounded bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <input
        type="tel"
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
        className="w-full p-2 mb-3 rounded bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <textarea
        name="message"
        placeholder="Message"
        value={form.message}
        onChange={handleChange}
        className="w-full p-2 mb-4 rounded bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="3"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition"
      >
        Submit
      </button>
    </form>
  );
}
