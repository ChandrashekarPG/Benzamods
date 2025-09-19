// src/components/admin/AdminsPage.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

export default function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [newAdmin, setNewAdmin] = useState({ name: "", username: "", password: "" });

  const token = localStorage.getItem("token");
  const currentAdminId = localStorage.getItem("adminId");

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await api.get("/admins", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmins(res.data);
      } catch (err) {
        console.error("Error fetching admins:", err.response || err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, [token]);

  const handleRemove = async (adminId) => {
    if (adminId === currentAdminId) {
      return alert("⚠️ You cannot remove yourself.");
    }

    if (!window.confirm("Are you sure you want to remove this admin?")) return;

    try {
      await api.delete(`/admins/${adminId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAdmins((prev) => prev.filter((admin) => admin._id !== adminId));
    } catch (err) {
      console.error("Error deleting admin:", err.response || err);
      alert("Failed to remove admin.");
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(
        "/admins",
        newAdmin,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAdmins((prev) => [...prev, res.data.admin]);
      setNewAdmin({ name: "", username: "", password: "" });
      alert("✅ Admin added successfully!");
    } catch (err) {
      console.error("Error adding admin:", err.response || err);
      alert(err.response?.data?.msg || "Failed to add admin.");
    }
  };

  if (loading) return <p>Loading admins...</p>;
  if (!admins.length) return <p>No admins found.</p>;

  const filteredAdmins = admins.filter((a) =>
    a.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="overflow-x-auto p-6 bg-gray-900 min-h-screen">
      {/* ➕ Add Admin Form */}
      <form
        onSubmit={handleAddAdmin}
        className="mb-6 p-4 bg-gray-800 rounded-lg shadow-lg flex gap-4 items-end"
      >
        <div className="flex flex-col">
          <label className="text-sm mb-1">Name</label>
          <input
            type="text"
            value={newAdmin.name}
            onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
            className="px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm mb-1">Username (Email)</label>
          <input
            type="email"
            value={newAdmin.username}
            onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
            className="px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm mb-1">Password</label>
          <input
            type="password"
            value={newAdmin.password}
            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
            className="px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
        >
          Add Admin
        </button>
      </form>

      {/* 🔎 Search Bar */}
      <div className="mb-6 flex justify-start">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-orange-500 rounded w-64 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none"
        />
      </div>

      {/* 📋 Admins Table */}
      <table className="min-w-full border border-gray-700 rounded-lg overflow-hidden">
        <thead className="bg-orange-500 text-white text-left">
          <tr>
            <th className="px-6 py-3 border">#</th>
            <th className="px-6 py-3 border">Name</th>
            <th className="px-6 py-3 border">Email</th>
            <th className="px-6 py-3 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 text-white">
          {filteredAdmins.map((admin, index) => (
            <tr key={admin._id} className="hover:bg-gray-700 transition-colors">
              <td className="px-6 py-3 border">{index + 1}</td>
              <td className="px-6 py-3 border">{admin.name}</td>
              <td className="px-6 py-3 border">{admin.username}</td>
              <td className="px-6 py-3 border text-center">
                <button
                  onClick={() => handleRemove(admin._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition-colors"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
          {filteredAdmins.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-400">
                No admins match your search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
