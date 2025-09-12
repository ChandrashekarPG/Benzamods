// src/components/admin/ServiceManager.jsx
import React, { useState, useEffect } from "react";
import api from "../api";

export default function ServiceManager() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState(""); // 🔎 search state
  const [form, setForm] = useState({
    name: "",
    serviceType: "",
    description: "",
    price: "",
    image: ""
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get("/services");
      setServices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addService = async (e) => {
    e.preventDefault();
    try {
      await api.post("/services", form);
      setForm({ name: "", serviceType: "", description: "", price: "", image: "" });
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const updateService = async (id) => {
    const newName = prompt("Enter new service name:", services.find(s => s._id === id).name);
    if (!newName) return;
    try {
      await api.put(`/services/${id}`, { name: newName });
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await api.delete(`/services/${id}`);
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔎 Filtered services based on search
  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(search.toLowerCase()) ||
    service.serviceType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mb-8 p-6 rounded bg-gray-900 shadow">
      <h2 className="text-2xl font-bold mb-6 text-center text-red-500">
        Manage Services
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
        onSubmit={addService}
      >
        <input
          type="text"
          placeholder="Service Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
        <input
          type="text"
          placeholder="Service Type"
          value={form.serviceType}
          onChange={e => setForm({ ...form, serviceType: e.target.value })}
          className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
          className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
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
          Add Service
        </button>
      </form>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div
              key={service._id}
              className="bg-gray-800 rounded-lg shadow p-4 flex flex-col"
            >
              <div className="flex items-center gap-4">
                {service.image && (
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{service.name}</h3>
                  <p className="text-red-400 text-sm">{service.serviceType}</p>
                  <p className="text-gray-300 font-semibold text-sm">₹{service.price}</p>
                </div>
              </div>

              {service.description && (
                <p className="text-gray-400 mt-2 text-sm">{service.description}</p>
              )}

              <div className="mt-3 flex gap-2">
                <button
                  className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                  onClick={() => updateService(service._id)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                  onClick={() => deleteService(service._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 col-span-2 text-center">No services found.</p>
        )}
      </div>
    </div>
  );
}
