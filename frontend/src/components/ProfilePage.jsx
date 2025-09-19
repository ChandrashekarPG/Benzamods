// src/components/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "./api";
import { FaUserCircle, FaEnvelope, FaUserTag, FaCalendarAlt } from "react-icons/fa";

export default function ProfilePage() {
  const { user, token, logoutUser } = useAuth();
  const [profile, setProfile] = useState(user || null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) return;
        const res = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    if (!user && token) {
      fetchProfile();
    }
  }, [user, token]);

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="w-full max-w-2xl bg-gray-900 text-white rounded-2xl shadow-2xl p-8 border border-gray-700">
        {/* Header */}
        <div className="flex flex-col items-center">
          <FaUserCircle className="text-7xl text-red-500 mb-4" />
          <h2 className="text-3xl font-bold mb-1">{profile.name}</h2>
          <p className="text-gray-400">Welcome back!</p>
        </div>

        {/* Info */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg shadow">
            <FaEnvelope className="text-red-400" />
            <p className="text-lg">{profile.email}</p>
          </div>

          <div className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg shadow">
            <FaUserTag className="text-orange-400" />
            <p className="text-lg capitalize">{profile.role || "User"}</p>
          </div>

          <div className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg shadow">
            <FaCalendarAlt className="text-blue-400" />
            <p className="text-lg">
              Joined on {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Logout */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={logoutUser}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-transform"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
