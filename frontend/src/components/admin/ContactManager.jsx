// src/components/admin/ContactManager.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ContactManager() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState(""); // 🔎 search state

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/contacts");
      setContacts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Delete this contact message?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/contacts/${id}`);
      fetchContacts();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔎 Filter contacts based on search
  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mb-8 p-6 rounded bg-gray-900 shadow">
      <h2 className="text-2xl font-bold mb-6 text-center text-red-500">
        Customer Contact / Messages
      </h2>

      {/* 🔎 Search Bar */}
      <div className="max-w-md mx-auto mb-6">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-800 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Contacts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <div
              key={contact._id}
              className="bg-gray-800 rounded-lg shadow p-4 flex flex-col"
            >
              <h3 className="text-lg font-bold text-white">{contact.name}</h3>
              <p className="text-red-400 text-sm">{contact.email}</p>
              {contact.phone && (
                <p className="text-gray-300 text-sm mt-1">📞 {contact.phone}</p>
              )}
              <p className="text-gray-400 text-sm mt-1">{contact.message}</p>

              <div className="mt-3 flex gap-2">
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                  onClick={() => deleteContact(contact._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 col-span-2 text-center">No contacts found.</p>
        )}
      </div>
    </div>
  );
}
