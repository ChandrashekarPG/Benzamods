// src/components/admin/InventoryManager.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function InventoryManager() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState(""); // 🔎 search state
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    image: ""
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/inventory");
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/inventory", form);
      setForm({ name: "", category: "", description: "", price: "", image: "" });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const updateItem = async (id) => {
    const newName = prompt("Enter new name:", items.find(i => i._id === id).name);
    if (!newName) return;
    try {
      await axios.put(`http://localhost:5000/api/inventory/${id}`, { name: newName });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/inventory/${id}`);
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔎 Filtered items based on search
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mb-8 p-6 rounded bg-gray-900 shadow">
      <h2 className="text-2xl font-bold mb-6 text-center text-red-500">
        Manage Products
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

      {/* Form */}
      <form
        className="flex flex-col gap-3 max-w-md mx-auto mb-8 bg-gray-800 p-4 rounded-lg"
        onSubmit={addItem}
      >
        <input
          type="text"
          placeholder="Item Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
          className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
          className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={form.image}
          onChange={e => setForm({ ...form, image: e.target.value })}
          className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Add Item
        </button>
      </form>

      {/* Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-gray-800 rounded-lg shadow p-4 flex flex-col"
            >
              {/* Header row */}
              <div className="flex items-center gap-4">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{item.name}</h3>
                  <p className="text-red-400 text-sm">{item.category}</p>
                  <p className="text-gray-300 font-semibold text-sm">₹{item.price}</p>
                </div>
              </div>

              {item.description && (
                <p className="text-gray-400 mt-2 text-sm">{item.description}</p>
              )}

              {/* Actions */}
              <div className="mt-3 flex gap-2">
                <button
                  className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                  onClick={() => updateItem(item._id)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                  onClick={() => deleteItem(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 col-span-2 text-center">No items found.</p>
        )}
      </div>
    </div>
  );
}
