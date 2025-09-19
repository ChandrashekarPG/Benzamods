// src/components/admin/EnquiriesPage.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);

  const fetchEnquiries = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/enquiries", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnquiries(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch enquiries");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enquiry?")) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/enquiries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnquiries(enquiries.filter((e) => e._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete enquiry");
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-blue-400 mb-4">Enquiries</h2>
      {enquiries.length === 0 ? (
        <p>No enquiries yet.</p>
      ) : (
        <table className="w-full text-left border border-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Message</th>
              <th className="p-2">Product</th>
              <th className="p-2">User</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enq) => (
              <tr key={enq._id} className="border-t border-gray-600">
                <td className="p-2">{enq.name}</td>
                <td className="p-2">{enq.email}</td>
                <td className="p-2">{enq.phone}</td>
                <td className="p-2">{enq.message}</td>
                <td className="p-2">{enq.product?.name || "N/A"}</td>
                <td className="p-2">{enq.user?.name || "Guest"}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(enq._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
