import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "./api";

export default function PortfolioDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await api.get(`/portfolios/${id}`);
      setProject(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!project) {
    return <p className="text-center mt-10 text-gray-400">Loading project...</p>;
  }

  return (
    <div className="p-6 bg-gradient-to-b from-gray-900 to-black min-h-screen text-white">
      {/* Back Button */}
      <Link
        to="/portfolio"
        className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white shadow-md transition-all duration-200"
      >
        ← Back to Portfolio
      </Link>

      {/* Title & Info */}
      <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
        {project.title}
      </h1>
      <p className="text-gray-400 text-lg">
        {project.brand} • {project.serviceType}
      </p>
      <p className="mt-4 text-gray-200 leading-relaxed">{project.description}</p>

      {/* Before & After Section */}
      <div className="mt-10 grid md:grid-cols-2 gap-8">
        {/* Before */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-red-300">Before</h2>
          <div className="grid grid-cols-1 gap-4">
            {project.beforeImages?.map((img, i) => (
              <div key={i} className="overflow-hidden rounded-xl shadow-lg">
                <img
                  src={img}
                  alt="Before"
                  className="rounded-xl w-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* After */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-green-300">After</h2>
          <div className="grid grid-cols-1 gap-4">
            {project.afterImages?.map((img, i) => (
              <div key={i} className="overflow-hidden rounded-xl shadow-lg">
                <img
                  src={img}
                  alt="After"
                  className="rounded-xl w-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Client Review Section */}
      {project.clientReview && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-center text-red-400 mb-6">
            Client Review
          </h3>

          <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl shadow-xl max-w-2xl mx-auto text-center">
            {project.clientReview.name && (
              <p className="font-semibold text-lg text-red-300">
                {project.clientReview.name}
              </p>
            )}

            {project.clientReview.rating && (
              <p className="text-yellow-400 text-xl mt-1">
                {"⭐".repeat(project.clientReview.rating)}{" "}
                <span className="text-gray-400 text-sm">
                  ({project.clientReview.rating}/5)
                </span>
              </p>
            )}

            {project.clientReview.review && (
              <p className="italic text-gray-300 mt-3 leading-relaxed">
                “{project.clientReview.review}”
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
