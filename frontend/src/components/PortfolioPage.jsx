import React, { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet"; 

export default function PortfolioPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await axios.get("http://localhost:5000/api/portfolios");
    setProjects(res.data);
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {/* ✅ SEO Meta Tags */}
      <Helmet>
        <title>Portfolio & Client Reviews | BenzaMods</title>
        <meta
          name="description"
          content="See BenzaMods' portfolio of bike and car modifications with before & after photos, client reviews, and successful tuning projects."
        />
        <meta
          name="keywords"
          content="benza mods portfolio, bike modification portfolio, car tuning projects, garage client reviews, custom modifications"
        />
        <meta property="og:title" content="Portfolio & Client Reviews | BenzaMods" />
        <meta
          property="og:description"
          content="Explore BenzaMods' successful car and bike modification projects with real client reviews and before/after transformations."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/portfolio" />
        <meta property="og:site_name" content="BenzaMods" />
      </Helmet>

      <h1 className="text-3xl font-bold text-center text-red-400 mb-6">
        Client Reviews & Portfolio
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div
            key={p._id}
            className="bg-gray-800 shadow-lg rounded-lg p-4 hover:scale-105 transition-transform"
          >
            <h2 className="text-xl font-semibold text-white">{p.title}</h2>
            <p className="text-gray-400 text-sm">
              {p.brand} • {p.serviceType}
            </p>
            <p className="mt-2 text-gray-300">{p.description}</p>

            {/* Before & After Images */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {p.beforeImages?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${p.title} - Before`}
                  className="rounded-lg w-full h-32 object-cover"
                />
              ))}
              {p.afterImages?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${p.title} - After`}
                  className="rounded-lg w-full h-32 object-cover"
                />
              ))}
            </div>

            {/* Client Review */}
            {p.clientReview && (
              <div className="mt-3 border-t border-gray-700 pt-3">
                {p.clientReview.name && (
                  <p className="font-semibold text-red-300">{p.clientReview.name}</p>
                )}

                {p.clientReview.rating && (
                  <p className="text-yellow-400">
                    {"⭐".repeat(p.clientReview.rating)} ({p.clientReview.rating}/5)
                  </p>
                )}

                {p.clientReview.review && (
                  <p className="italic text-gray-300 mt-1">
                    “{p.clientReview.review}”
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
