import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PortfolioAdmin() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/portfolios");
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/portfolios/${id}`);
      fetchProjects();
    } catch (err) {
      console.error("Error deleting project", err);
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-white">
        Portfolio Admin
      </h2>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search by project name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 
                     placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Project List */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <div
              key={p._id}
              className="bg-gray-800 border border-gray-700 shadow-md rounded-lg p-4 
                         flex flex-col justify-between hover:shadow-lg hover:border-blue-500 transition"
            >
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {p.title}
                </h3>
                <p className="text-sm text-gray-400 mb-1">
                  <span className="font-semibold text-gray-300">Brand:</span>{" "}
                  {p.brand}
                </p>
                <p className="text-sm text-gray-400 mb-1">
                  <span className="font-semibold text-gray-300">Service:</span>{" "}
                  {p.serviceType}
                </p>
                <p className="text-sm text-gray-500 line-clamp-3">
                  {p.description}
                </p>
              </div>

              {/* Before/After images preview */}
              {(p.beforeImages?.length > 0 || p.afterImages?.length > 0) && (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {p.beforeImages?.slice(0, 1).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="Before"
                      className="h-24 w-full object-cover rounded-md border border-gray-700"
                    />
                  ))}
                  {p.afterImages?.slice(0, 1).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="After"
                      className="h-24 w-full object-cover rounded-md border border-gray-700"
                    />
                  ))}
                </div>
              )}

              {/* Delete button */}
              <button
                onClick={() => handleDelete(p._id)}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No projects found.</p>
      )}
    </div>
  );
}
