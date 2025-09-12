import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "./api";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [toast, setToast] = useState(""); // Custom alert message

  const { token, requireUserLogin } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err.response?.data || err.message);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    try {
      const res = await api.post(
        "/cart",
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.updated) {
        showToast("Quantity updated in cart!");
      } else {
        showToast("Product added to cart!");
      }
    } catch (err) {
      console.error("Error adding to cart:", err.response?.data || err.message);
      if (!token) {
        showToast("Now you can add the product!");
      } else {
        showToast("Now you can add the product.");
      }
    }
  };

  const handleAddToCart = () => requireUserLogin(addToCart);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000); // Hide after 3 seconds
  };

  if (!product) {
    return <p className="text-center mt-10 text-white">Loading product...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4 relative">
      <div className="max-w-5xl mx-auto bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <img
          src={product.images?.[0] || "https://via.placeholder.com/1200x600"}
          alt={product.name}
          className="w-full h-auto object-cover border-b-4 border-red-500"
        />

        <div className="p-6 flex flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-bold text-red-500">{product.name}</h1>
          <p className="text-gray-300 text-lg">{product.description}</p>
          <p className="text-3xl font-semibold text-yellow-400">₹{product.price}</p>

          <button
            onClick={handleAddToCart}
            className="bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition duration-300"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Custom Toast Popup */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg z-50"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;
