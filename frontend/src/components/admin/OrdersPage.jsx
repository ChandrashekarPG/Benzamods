// src/components/admin/OrdersPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err.response || err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  const handleRemove = async (orderId) => {
    if (!window.confirm("Are you sure you want to remove this order?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch (err) {
      console.error("Error deleting order:", err.response || err);
      alert("Failed to remove order.");
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (!orders.length) return <p>No orders found.</p>;

  const filteredOrders = orders.filter((o) =>
    o.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="overflow-x-auto p-6 bg-gray-900 min-h-screen">
      {/* 🔎 Search Bar */}
      <div className="mb-6 flex justify-start">
        <input
          type="text"
          placeholder="Search by user name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-orange-500 rounded w-64 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none"
        />
      </div>

      {/* 📋 Orders Table */}
      <table className="min-w-full border border-gray-700 rounded-lg overflow-hidden">
        <thead className="bg-orange-500 text-white text-left">
          <tr>
            <th className="px-6 py-3 border">#</th>
            <th className="px-6 py-3 border">User</th>
            <th className="px-6 py-3 border">Products</th>
            <th className="px-6 py-3 border">Total Price</th>
            <th className="px-6 py-3 border">Status</th>
            <th className="px-6 py-3 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 text-white">
          {filteredOrders.map((order, index) => (
            <tr key={order._id} className="hover:bg-gray-700 transition-colors">
              <td className="px-6 py-3 border">{index + 1}</td>
              <td className="px-6 py-3 border">{order.user?.name || "N/A"}</td>
              <td className="px-6 py-3 border">
                {order.items?.map((item, idx) => (
                  <div key={idx}>
                    {item.product?.name || "Product"} x {item.qty}
                  </div>
                ))}
              </td>
              <td className="px-6 py-3 border">{order.total}</td>
              <td className="px-6 py-3 border">{order.status}</td>
              <td className="px-6 py-3 border text-center">
                <button
                  onClick={() => handleRemove(order._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition-colors"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
          {filteredOrders.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-400">
                No orders match your search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
