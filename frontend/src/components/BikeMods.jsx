import React, { useEffect, useState } from "react";
import api from "./api";
import EnquiryForm from "./EnquiryForm";
import LoginModal from "./LoginModal";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const BikeMods = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
  });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products?type=bike");
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const applyFilter = () => {
    const filtered = products.filter((p) => {
      const matchesCategory = filters.category
        ? p.category.toLowerCase().includes(filters.category.toLowerCase())
        : true;
      const matchesMinPrice = filters.minPrice ? p.price >= filters.minPrice : true;
      const matchesMaxPrice = filters.maxPrice ? p.price <= filters.maxPrice : true;
      return matchesCategory && matchesMinPrice && matchesMaxPrice;
    });
    setFilteredProducts(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-gray-200 p-6">
      {/* ✅ SEO Meta Tags */}
      <Helmet>
        <title>Bike Mods | BenzaMods - Bike Tuning & Custom Accessories</title>
        <meta
          name="description"
          content="Discover top-quality bike modification products at BenzaMods. From tuning parts to stylish accessories, perfect for bike owners, dealerships, and garages."
        />
        <meta
          name="keywords"
          content="bike mods, bike tuning, motorcycle accessories, custom bike parts, BenzaMods, bike performance upgrades, bike garages, dealerships"
        />
        <meta property="og:title" content="Bike Mods | BenzaMods" />
        <meta
          property="og:description"
          content="Upgrade your ride with BenzaMods bike modification products. Perfect for enthusiasts, workshops, and resellers."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/bike-mods" />
        <meta property="og:site_name" content="BenzaMods" />
      </Helmet>

      <h2 className="pt-24 text-4xl font-extrabold text-center mb-10 text-yellow-400 tracking-wide">
        🏍️ Bike Modification Products
      </h2>

            {/* Filters */}
      <div className="mb-10 max-w-2xl mx-auto p-5 rounded-xl bg-gradient-to-r from-gray-800/80 via-gray-900/80 to-gray-800/80 
                      backdrop-blur-md shadow-xl border border-gray-700">
        <h3 className="text-lg font-semibold text-yellow-400 mb-4 text-center">
          🔍 Filter by Price
        </h3>
        <div className="flex flex-wrap gap-3 justify-center">
          <input
            name="minPrice"
            type="number"
            placeholder="💰 Min Price"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="w-36 border border-gray-600 bg-gray-900 text-gray-200 p-2 rounded-lg 
                       focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none 
                       placeholder-gray-500 shadow-inner"
          />
          <input
            name="maxPrice"
            type="number"
            placeholder="💰 Max Price"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="w-36 border border-gray-600 bg-gray-900 text-gray-200 p-2 rounded-lg 
                       focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none 
                       placeholder-gray-500 shadow-inner"
          />
          <button
            onClick={applyFilter}
            className="px-5 py-2 rounded-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 
                       hover:from-green-600 hover:to-green-700 text-white shadow-md 
                       hover:shadow-green-500/40 transition-all duration-300 ease-in-out"
          >
            Apply
          </button>
        </div>
      </div>


      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredProducts.map((prod) => (
          <div
            key={prod._id}
            className="relative shadow-lg rounded-xl bg-gray-800/70 backdrop-blur-md p-5 hover:scale-105 transition-transform duration-200"
          >
            <Link to={`/products/${prod._id}`}>
              <img
                src={prod.images?.[0] || "https://via.placeholder.com/400x250"}
                alt={prod.name}
                className="w-full h-48 object-cover rounded-lg mb-3 shadow-md"
              />
              <h2 className="text-xl font-bold text-orange-400">{prod.name}</h2>
              <p className="text-gray-400 mt-1 line-clamp-3">{prod.description}</p>
              <p className="text-lg font-semibold mt-2 text-green-400">
                ₹{prod.price}
              </p>
            </Link>
          </div>
        ))}
      </div>

      {/* Smaller Enquiry Form */}
      <div className="mt-12 max-w-lg mx-auto p-4 border border-gray-700 rounded-xl bg-gray-800/60 backdrop-blur-md shadow-lg">
        <EnquiryForm
          type="bike"
          user={user}
          onRequireLogin={() => setIsLoginOpen(true)}
        />
      </div>

      {/* Login modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        role="user"
        onSuccess={() => {
          const saved = localStorage.getItem("user");
          if (saved) setUser(JSON.parse(saved));
        }}
      />
    </div>
  );
};

export default BikeMods;
