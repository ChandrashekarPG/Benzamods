// src/components/admin/UsersPage.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err.response || err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const handleRemove = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;

    try {
      await api.delete(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err.response || err);
      alert("Failed to remove user.");
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (!users.length) return <p>No users found.</p>;

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="overflow-x-auto p-6 bg-gray-900 min-h-screen">
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

      {/* 📋 Users Table */}
      <table className="min-w-full border border-gray-700 rounded-lg overflow-hidden">
        <thead className="bg-orange-500 text-white text-left">
          <tr>
            <th className="px-6 py-3 border">#</th>
            <th className="px-6 py-3 border">Name</th>
            <th className="px-6 py-3 border">Email</th>
            <th className="px-6 py-3 border">Role</th>
            <th className="px-6 py-3 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 text-white">
          {filteredUsers.map((user, index) => (
            <tr key={user._id} className="hover:bg-gray-700 transition-colors">
              <td className="px-6 py-3 border">{index + 1}</td>
              <td className="px-6 py-3 border">{user.name}</td>
              <td className="px-6 py-3 border">{user.email}</td>
              <td className="px-6 py-3 border">{user.role}</td>
              <td className="px-6 py-3 border text-center">
                <button
                  onClick={() => handleRemove(user._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition-colors"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-400">
                No users match your search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
