// src/components/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "./api";
import {
  FaUserCircle,
  FaEnvelope,
  FaUserTag,
  FaBoxOpen,
  FaChevronDown,
  FaChevronUp,
  FaLock,
  FaPhone,
  FaHome,
} from "react-icons/fa";

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(user || null);
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [changing, setChanging] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    contactNumber: "",
    address: "",
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false); // 👈 toggle state

  // Fetch profile if not already
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) return;
        const res = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setEditForm({
          name: res.data.name || "",
          contactNumber: res.data.contactNumber || "",
          address: res.data.address || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

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

  // Toggle order details
  const toggleExpand = (orderId) => {
    setExpanded((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      setChanging(true);
      await api.put("/users/change-password", passwordForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Password updated successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "" });
      setShowPasswordForm(false); // hide after success
    } catch (err) {
      console.error("Password change error:", err);
      alert(err.response?.data?.msg || "Failed to change password");
    } finally {
      setChanging(false);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/users/update", editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.user);
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);
      alert(err.response?.data?.msg || "Failed to update profile");
    }
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 pt-24">
      <div className="w-full max-w-4xl bg-gray-900 text-white rounded-2xl shadow-2xl p-8 border border-gray-700">
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

          {/* Contact Number */}
          <div className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg shadow">
            <FaPhone className="text-green-400" />
            <p className="text-lg">
              {profile.contactNumber || "No contact number added"}
            </p>
          </div>

          {/* Address */}
          <div className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg shadow">
            <FaHome className="text-blue-400" />
            <p className="text-lg">{profile.address || "No address added"}</p>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="mt-6">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Edit Profile
            </button>
          ) : (
            <form
              onSubmit={handleProfileUpdate}
              className="space-y-4 bg-gray-800 p-6 rounded-lg shadow mt-4"
            >
              <input
                type="text"
                placeholder="Name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white"
              />
              <input
                type="text"
                placeholder="Contact Number"
                value={editForm.contactNumber}
                onChange={(e) =>
                  setEditForm({ ...editForm, contactNumber: e.target.value })
                }
                className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white"
              />
              <textarea
                placeholder="Address"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white"
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Change Password */}
        <div className="mt-10">
          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Change Password
            </button>
          ) : (
            <form
              onSubmit={handlePasswordChange}
              className="space-y-4 bg-gray-800 p-6 rounded-lg shadow mt-4"
            >
              <input
                type="password"
                placeholder="Current Password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
                className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white"
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white"
                required
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={changing}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                >
                  {changing ? "Updating..." : "Update Password"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Manage Orders */}
        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-red-400 mb-6 flex items-center gap-2">
            <FaBoxOpen /> My Orders
          </h3>

          {orders.length === 0 ? (
            <p className="text-gray-400">You have not placed any orders yet.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
              {orders.map((order, idx) => (
                <div
                  key={order._id}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <h4 className="text-lg font-semibold text-white mb-2 flex justify-between items-center">
                    Order #{idx + 1}
                    <button
                      onClick={() => toggleExpand(order._id)}
                      className="text-gray-400 hover:text-white"
                    >
                      {expanded[order._id] ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </h4>

                  <p className="text-green-400 font-semibold mb-1">
                    Total: ₹{order.total}
                  </p>
                  <p className="capitalize mb-4">
                    Status: <span className="text-red-400">{order.status}</span>
                  </p>

                  {expanded[order._id] && (
                    <div className="bg-gray-700 p-3 rounded-lg mb-4">
                      <h5 className="text-md font-semibold mb-2">Order Details</h5>
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 mb-2 border-b border-gray-600 pb-2"
                        >
                          {item.product?.images?.[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product?.name}
                              className="w-12 h-12 rounded object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-600 rounded flex items-center justify-center text-gray-300">
                              🛒
                            </div>
                          )}
                          <div>
                            <p className="text-white font-medium">
                              {item.product?.name || "Product"}
                            </p>
                            <p className="text-gray-400 text-sm">
                              Qty: {item.qty} × ₹{item.priceAtOrder}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* 🔴 Removed the Remove Order button here */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
