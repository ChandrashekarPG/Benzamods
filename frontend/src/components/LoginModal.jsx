// src/components/LoginModal.jsx
import React, { useState } from "react";
import api from "./api";

export default function LoginModal({ isOpen, onClose, role, onSuccess }) {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  if (!isOpen) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isSignup ? "/auth/signup" : "/auth/login";

      const body = isSignup
        ? { ...form, role }
        : { email: form.email, password: form.password, role };

      const res = await api.post(endpoint, body);

      if (!isSignup) {
        const loggedInUser = {
          _id: res.data.user._id,
          name: res.data.user.name,
          email: res.data.user.email || res.data.user.username,
          role: (res.data.user.role || role || "user").toLowerCase(),
        };

        const receivedToken = res.data.token;
        if (onSuccess) onSuccess(role, loggedInUser, receivedToken);
      } else {
        alert("Signup successful! Please login.");
        setIsSignup(false);
      }

      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Error occurred. Please try again.");
    }
  };

  // 🎨 Theme based on role
  const isAdmin = role === "admin";
  const accent = isAdmin ? "red" : "yellow";
  const titleIcon = isAdmin ? "🔑" : "👤";
  const titleText = isSignup && !isAdmin
    ? `Signup as ${role}`
    : `Login as ${role}`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-96 border border-gray-700">
        <h2
          className={`text-2xl font-bold mb-6 text-center ${
            isAdmin ? "text-red-400" : "text-yellow-400"
          }`}
        >
          {titleIcon} {titleText}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && !isAdmin && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none"
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder={isAdmin ? "Username" : "Email"}
            value={form.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 ${
              isAdmin ? "focus:ring-red-400" : "focus:ring-yellow-400"
            } outline-none`}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 ${
              isAdmin ? "focus:ring-red-400" : "focus:ring-yellow-400"
            } outline-none`}
            required
          />

          <button
            type="submit"
            className={`w-full ${
              isAdmin
                ? "bg-red-500 hover:bg-red-600"
                : "bg-yellow-500 hover:bg-yellow-600 text-black"
            } font-semibold py-2 rounded-lg shadow-md transition`}
          >
            {isSignup && !isAdmin ? "Signup" : "Login"}
          </button>
        </form>

        {/* ✅ Hide signup for admins */}
        {!isAdmin && (
          <p className="mt-4 text-sm text-center text-gray-400">
            {isSignup ? "Already have an account?" : "New user?"}{" "}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-yellow-400 hover:underline"
            >
              {isSignup ? "Login" : "Signup"}
            </button>
          </p>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full bg-gray-700 hover:bg-gray-600 text-gray-200 py-2 rounded-lg transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
