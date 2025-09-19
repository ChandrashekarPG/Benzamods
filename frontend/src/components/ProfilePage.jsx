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
} from "react-icons/fa";

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(user || null);
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState({}); // track expanded orders

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

  // Handle remove order
  const handleRemove = async (orderId) => {
    if (!window.confirm("Are you sure you want to remove this order?")) return;

    try {
      await api.delete(`/orders/my/${orderId}`, {
  headers: { Authorization: `Bearer ${token}` },
});

      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Failed to remove order.");
    }
  };

  // Toggle order details
  const toggleExpand = (orderId) => {
    setExpanded((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
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
                    Status:{" "}
                    <span className="text-red-400">{order.status}</span>
                  </p>

                  {/* Expanded details */}
                  {expanded[order._id] && (
                    <div className="bg-gray-700 p-3 rounded-lg mb-4">
                      <h5 className="text-md font-semibold mb-2">
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

                  <button
                    onClick={() => handleRemove(order._id)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Remove Order
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
