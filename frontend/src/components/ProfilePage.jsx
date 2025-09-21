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

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Fetch profile
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
    if (token) fetchProfile();
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
      setShowPasswordForm(false);
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
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6 pt-24">
      <div className="w-full max-w-5xl bg-gray-900/70 backdrop-blur-xl text-white rounded-3xl shadow-2xl p-10 border border-gray-700 relative overflow-hidden">
        {/* Animated Glow Background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-red-600/20 via-yellow-400/10 to-purple-500/20 blur-3xl"></div>

        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <FaUserCircle className="text-8xl text-red-500 mb-4 drop-shadow-lg" />
          <h2 className="text-4xl font-extrabold mb-2">{profile.name}</h2>
          <p className="text-gray-400 text-lg">Welcome back 👋</p>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-center gap-3 bg-gray-800/60 p-5 rounded-xl shadow hover:shadow-red-400/30 transition">
            <FaEnvelope className="text-red-400 text-xl" />
            <p className="text-lg">{profile.email}</p>
          </div>

          <div className="flex items-center gap-3 bg-gray-800/60 p-5 rounded-xl shadow hover:shadow-orange-400/30 transition">
            <FaUserTag className="text-orange-400 text-xl" />
            <p className="text-lg capitalize">{profile.role || "User"}</p>
          </div>

          <div className="flex items-center gap-3 bg-gray-800/60 p-5 rounded-xl shadow hover:shadow-green-400/30 transition">
            <FaPhone className="text-green-400 text-xl" />
            <p className="text-lg">{profile.contactNumber || "No contact number added"}</p>
          </div>

          <div className="flex items-center gap-3 bg-gray-800/60 p-5 rounded-xl shadow hover:shadow-blue-400/30 transition">
            <FaHome className="text-blue-400 text-xl" />
            <p className="text-lg">{profile.address || "No address added"}</p>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="mt-8">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 px-6 py-3 rounded-xl font-semibold shadow-lg transition"
            >
              ✏️ Edit Profile
            </button>
          ) : (
            <form
              onSubmit={handleProfileUpdate}
              className="space-y-4 bg-gray-800/70 p-6 rounded-xl shadow-xl mt-4"
            >
              <input
                type="text"
                placeholder="Name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Contact Number"
                value={editForm.contactNumber}
                onChange={(e) =>
                  setEditForm({ ...editForm, contactNumber: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-green-500"
              />
              <textarea
                placeholder="Address"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
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
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:opacity-90 px-6 py-3 rounded-xl font-semibold shadow-lg transition"
            >
              🔒 Change Password
            </button>
          ) : (
            <form
              onSubmit={handlePasswordChange}
              className="space-y-4 bg-gray-800/70 p-6 rounded-xl shadow-xl mt-4"
            >
              <input
                type="password"
                placeholder="Current Password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-red-500"
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-pink-500"
                required
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={changing}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  {changing ? "Updating..." : "Update Password"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Orders */}
        <div className="mt-12">
          <h3 className="text-3xl font-bold text-yellow-400 mb-6 flex items-center gap-3">
            <FaBoxOpen /> My Orders
          </h3>

          {orders.length === 0 ? (
            <p className="text-gray-400 text-lg">You have not placed any orders yet.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
              {orders.map((order, idx) => (
                <div
                  key={order._id}
                  className="bg-gray-800/70 border border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-yellow-400/30 transition"
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
                    <div className="bg-gray-700/60 p-4 rounded-lg mb-4">
                      <h5 className="text-md font-semibold mb-2 text-yellow-300">
                        Order Details
                      </h5>
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 mb-2 border-b border-gray-600 pb-2"
                        >
                          {item.product?.images?.[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product?.name}
                              className="w-14 h-14 rounded object-cover"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-gray-600 rounded flex items-center justify-center text-gray-300">
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
