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

        // Parent handles navigation / storage
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {isSignup ? `Signup as ${role}` : `Login as ${role}`}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
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
            placeholder="Email"
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
            {isSignup ? "Signup" : "Login"}
          </button>
        </form>

        <p className="mt-3 text-sm text-center">
          {isSignup ? "Already have an account?" : "New user?"}{" "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-red-500 underline"
          >
            {isSignup ? "Login" : "Signup"}
          </button>
        </p>

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
