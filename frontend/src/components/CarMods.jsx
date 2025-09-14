import React, { useEffect, useState } from "react";
import api from "./api";
import EnquiryForm from "./EnquiryForm";
import LoginModal from "./LoginModal";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const CarMods = () => {
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

  // ✅ State for Add Product form
  const [newProduct, setNewProduct] = useState({
    name: "",
    type: "car",
    description: "",
    price: "",
    image: "",
  });

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products?type=car");
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
      const matchesMinPrice = filters.minPrice
        ? p.price >= filters.minPrice
        : true;
      const matchesMaxPrice = filters.maxPrice
        ? p.price <= filters.maxPrice
        : true;
      return matchesCategory && matchesMinPrice && matchesMaxPrice;
    });
    setFilteredProducts(filtered);
  };

  // ✅ Handle Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: newProduct.name,
        type: newProduct.type,
        description: newProduct.description,
        price: Number(newProduct.price),
        images: [newProduct.image],
      };
      await api.post("/products", payload);
      alert("✅ Product added successfully!");
      setNewProduct({
        name: "",
        type: "car",
        description: "",
        price: "",
        image: "",
      });
      fetchProducts(); // refresh list
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add product");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-gray-200 p-6">
      {/* ✅ SEO Meta Tags */}
      <Helmet>
        <title>Car Mods | BenzaMods - Car Tuning & Performance Upgrades</title>
        <meta
          name="description"
          content="Explore premium car modification products at BenzaMods. From performance upgrades to styling accessories, perfect for car owners, dealerships, and garages."
        />
        <meta
          name="keywords"
          content="car mods, car tuning, performance upgrades, custom car parts, BenzaMods, dealerships, garages, car accessories"
        />
        <meta property="og:title" content="Car Mods | BenzaMods" />
        <meta
          property="og:description"
          content="Find the best car modification and tuning products with BenzaMods. Ideal for car enthusiasts, garages, and dealerships."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/car-mods" />
        <meta property="og:site_name" content="BenzaMods" />
      </Helmet>

      <h1 className="text-4xl font-extrabold text-center mb-10 text-blue-400 tracking-wide">
        🚗 Car Modification Products
      </h1>

      {/* ✅ Add Product Form */}
      <form
        onSubmit={handleAddProduct}
        className="mb-10 p-6 border border-gray-700 rounded-xl bg-gray-800/60 backdrop-blur-md shadow-lg max-w-2xl mx-auto"
      >
        <h2 className="text-2xl font-bold mb-4 text-green-400">➕ Add Product</h2>
        <div className="grid gap-4">
          <input
            type="text"
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="border border-gray-600 bg-gray-900 text-gray-200 p-2 rounded"
            required
          />
          <select
            value={newProduct.type}
            onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
            className="border border-gray-600 bg-gray-900 text-gray-200 p-2 rounded"
          >
            <option value="car">Car</option>
            <option value="bike">Bike</option>
          </select>
          <textarea
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            className="border border-gray-600 bg-gray-900 text-gray-200 p-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className="border border-gray-600 bg-gray-900 text-gray-200 p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newProduct.image}
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
            className="border border-gray-600 bg-gray-900 text-gray-200 p-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
        >
          Add Product
        </button>
      </form>

      {/* Filters */}
      <div className="mb-10 p-5 border border-gray-700 rounded-xl bg-gray-800/60 backdrop-blur-md flex flex-wrap gap-4 items-end shadow-lg">
        <input
          name="category"
          placeholder="Filter by Category"
          value={filters.category}
          onChange={handleFilterChange}
          className="border border-gray-600 bg-gray-900 text-gray-200 p-2 rounded w-60 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          name="minPrice"
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleFilterChange}
          className="border border-gray-600 bg-gray-900 text-gray-200 p-2 rounded w-40 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          name="maxPrice"
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          className="border border-gray-600 bg-gray-900 text-gray-200 p-2 rounded w-40 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          onClick={applyFilter}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition-all duration-200"
        >
          Apply Filter
        </button>
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
                src={prod.images[0] || "https://via.placeholder.com/400x250"}
                alt={prod.name}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h2 className="text-xl font-bold text-blue-400">{prod.name}</h2>
              <p className="text-gray-400 mt-1">{prod.description}</p>
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
          type="car"
          user={user}
          onRequireLogin={() => setIsLoginOpen(true)}
        />
      </div>

      {/* Shared User Login Modal */}
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

export default CarMods;
