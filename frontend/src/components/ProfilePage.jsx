// src/components/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "./api";

export default function ProfilePage() {
  const { user, token } = useAuth();
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

  if (!profile) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-red-500 mb-4">My Profile</h2>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Role:</strong> {profile.role || "User"}</p>
      <p><strong>Joined:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
    </div>
  );
}
