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
      let endpoint;
      let body;

      if (role === "admin") {
        // ✅ Admin login only
        endpoint = "/adminAuth/login";
        body = { username: form.email, password: form.password };
      } else {
        // ✅ User login/signup
        endpoint = isSignup ? "/auth/signup" : "/auth/login";
        body = isSignup
          ? { ...form, role }
          : { email: form.email, password: form.password, role };
      }

      const res = await api.post(endpoint, body);

      if (role === "admin") {
        const loggedInAdmin = {
          _id: res.data.admin.id,
          name: res.data.admin.name,
          email: res.data.admin.username,
          role: "admin",
        };
        const receivedToken = res.data.token;

        if (onSuccess) onSuccess("admin", loggedInAdmin, receivedToken);
      } else {
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
      }

      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Error occurred. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {isSignup && role !== "admin"
            ? `Signup as ${role}`
            : `Login as ${role}`}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Only show Name field if signup AND not admin */}
          {isSignup && role !== "admin" && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder={role === "admin" ? "Username" : "Email"}
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />

          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            {isSignup && role !== "admin" ? "Signup" : "Login"}
          </button>
        </form>

        {/* ✅ Hide signup toggle for admin */}
        {role !== "admin" && (
          <p className="mt-3 text-sm text-center">
            {isSignup ? "Already have an account?" : "New user?"}{" "}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-red-500 underline"
            >
              {isSignup ? "Login" : "Signup"}
            </button>
          </p>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full border py-2 rounded hover:bg-gray-100"
        >
          Close
        </button>
      </div>
    </div>
  );
}
