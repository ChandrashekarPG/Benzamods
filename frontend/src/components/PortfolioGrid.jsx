import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";

export default function PortfolioGrid() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Car",
    brand: "",
    serviceType: "",
    beforeImages: "",
    afterImages: "",
    clientReview: { name: "", review: "", rating: 5 },
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [search]);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/portfolios");
      let data = res.data;

      if (search.trim()) {
        data = data.filter((p) =>
          p.title.toLowerCase().includes(search.toLowerCase())
        );
      }
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        beforeImages: form.beforeImages.split(",").map((url) => url.trim()),
        afterImages: form.afterImages.split(",").map((url) => url.trim()),
      };

      await api.post("/portfolios", payload);

      setForm({
        title: "",
        description: "",
        category: "Car",
        brand: "",
        serviceType: "",
        beforeImages: "",
        afterImages: "",
        clientReview: { name: "", review: "", rating: 5 },
      });
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      console.error("Error adding portfolio:", err);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-b from-gray-900 to-black min-h-screen text-white">
      <h2 className="text-4xl font-extrabold mb-6 text-center text-yellow-400 tracking-wide">
        🚘 Our Portfolio
      </h2>

      {/* Search Bar */}
      <div className="flex justify-between items-center mb-8">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow w-80 focus:ring-2 focus:ring-yellow-500"
        />
        <button
          onClick={() => setShowForm(true)}
          className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
        >
          ➕ Add Review
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.length > 0 ? (
          projects.map((p) => (
            <Link
              to={`/portfolio/${p._id}`}
              key={p._id}
              className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
            >
              <img
                src={p.afterImages[0]}
                alt={p.title}
                className="w-full h-52 object-cover hover:opacity-90 transition"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-yellow-400">
                  {p.title}
                </h3>
                <p className="text-sm text-gray-400">
                  {p.brand} | {p.serviceType}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-3">
            No projects found.
          </p>
        )}
      </div>

      {/* Portfolio Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl shadow-xl w-[500px] max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">
              Add New Client Review
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full p-2 rounded bg-gray-800 text-white"
              >
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
              </select>
              <input
                type="text"
                placeholder="Brand"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
              <input
                type="text"
                placeholder="Service Type"
                value={form.serviceType}
                onChange={(e) =>
                  setForm({ ...form, serviceType: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
              <input
                type="text"
                placeholder="Before Images (comma separated URLs)"
                value={form.beforeImages}
                onChange={(e) =>
                  setForm({ ...form, beforeImages: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
              <input
                type="text"
                placeholder="After Images (comma separated URLs)"
                value={form.afterImages}
                onChange={(e) =>
                  setForm({ ...form, afterImages: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
              <input
                type="text"
                placeholder="Client Name"
                value={form.clientReview.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    clientReview: { ...form.clientReview, name: e.target.value },
                  })
                }
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
              <textarea
                placeholder="Client Review"
                value={form.clientReview.review}
                onChange={(e) =>
                  setForm({
                    ...form,
                    clientReview: {
                      ...form.clientReview,
                      review: e.target.value,
                    },
                  })
                }
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
              <select
                value={form.clientReview.rating}
                onChange={(e) =>
                  setForm({
                    ...form,
                    clientReview: {
                      ...form.clientReview,
                      rating: Number(e.target.value),
                    },
                  })
                }
                className="w-full p-2 rounded bg-gray-800 text-white"
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {r} Star{r > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
