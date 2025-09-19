// src/components/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "./api";
import { FaUserCircle, FaEnvelope, FaUserTag } from "react-icons/fa";

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(user || null);
  const [orders, setOrders] = useState([]);

  // Fetch profile if not already
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

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!token) return;
        const res = await api.get("/orders/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [token]);

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="w-full max-w-3xl bg-gray-900 text-white rounded-2xl shadow-2xl p-8 border border-gray-700">
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
        </div>

        {/* Manage Orders */}
        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-red-400 mb-4">My Orders</h3>
          {orders.length === 0 ? (
            <p className="text-gray-400">You have not placed any orders yet.</p>
          ) : (
            <table className="w-full text-left border border-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-red-600">
                <tr>
                  <th className="p-3 border">#</th>
                  <th className="p-3 border">Products</th>
                  <th className="p-3 border">Total</th>
                  <th className="p-3 border">Status</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800">
                {orders.map((order, idx) => (
                  <tr key={order._id} className="hover:bg-gray-700 transition-colors">
                    <td className="p-3 border">{idx + 1}</td>
                    <td className="p-3 border">
                      {order.items.map((item, i) => (
                        <div key={i}>
                          {item.product?.name || "Product"} × {item.qty}
                        </div>
                      ))}
                    </td>
                    <td className="p-3 border text-green-400 font-semibold">
                      ₹{order.total}
                    </td>
                    <td className="p-3 border capitalize">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
