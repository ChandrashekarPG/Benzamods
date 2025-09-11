import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function MyCart() {
  const { user, token, requireUserLogin } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(""); // For order confirmation
  const [customer, setCustomer] = useState({ name: "", email: "" });

  // Fetch user's cart
  const fetchCart = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data);
    } catch (err) {
      console.error("Error fetching cart:", err.response?.data || err.message);
    }
  };

  const removeItem = async (productId) => {
    if (!token) return;
    try {
      await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (err) {
      console.error("Error removing item:", err.response?.data || err.message);
    }
  };

  const updateQuantity = async (productId, newQty) => {
    if (!token || newQty < 1) return;
    try {
      await axios.put(
        `http://localhost:5000/api/cart/${productId}`,
        { qty: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      console.error("Error updating quantity:", err.response?.data || err.message);
    }
  };

  const submitOrder = async () => {
    if (!token) return;

    try {
      const items = cartItems.map((item) => ({
        productId: item.product._id,
        qty: item.qty,
      }));

      await axios.post(
        "http://localhost:5000/api/orders/place",
        { items, customer },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowForm(false);
      setCustomer({ name: "", email: "" });
      fetchCart();

      // Show toast
      showToast("✅ Your order has been placed successfully!");
    } catch (err) {
      console.error("Error placing order:", err.response?.data || err.message);
      showToast("❌ Failed to place order. Please try again!");
    }
  };

  const handleRemoveItem = (productId) => requireUserLogin(() => removeItem(productId));
  const handlePlaceOrder = () => requireUserLogin(() => setShowForm(true));

  useEffect(() => {
    fetchCart();
  }, [user, token]);

  const total = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.qty,
    0
  );

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000); // Hide after 4 seconds
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 relative">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">My Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-400 mt-6 text-center text-lg">Your cart is empty.</p>
      ) : (
        <>
          {/* CART ITEMS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cartItems.map((item) => (
              <div
                key={item.product._id}
                className="p-4 border border-gray-700 rounded-lg bg-gray-800 shadow-md hover:shadow-lg transition"
              >
                <img
                  src={item.product?.images?.[0] || "https://via.placeholder.com/150"}
                  alt={item.product?.name}
                  className="w-full h-40 object-cover rounded mb-2 border border-gray-600"
                />
                <h2 className="text-xl font-semibold text-red-400">
                  {item.product?.name}
                </h2>
                <p className="text-gray-300 mb-1">{item.product?.description}</p>
                <p className="text-yellow-400 font-semibold">
                  Price: ₹{item.product?.price}
                </p>

                <div className="flex items-center gap-3 my-2">
                  <button
                    onClick={() => updateQuantity(item.product._id, item.qty - 1)}
                    className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded"
                  >
                    -
                  </button>
                  <span className="text-lg">{item.qty}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.qty + 1)}
                    className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.product._id)}
                  className="mt-3 bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg text-white px-4 py-2 rounded-lg transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* TOTAL & PLACE ORDER */}
          <div className="mt-6 p-4 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-green-400 mb-3 md:mb-0">
              Total: ₹{total}
            </h2>
            <button
              onClick={handlePlaceOrder}
              className="bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg text-white px-6 py-3 rounded-lg transition"
            >
              Place Order
            </button>
          </div>
        </>
      )}

      {/* POPUP FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-96">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Enter Details</h2>
            <input
              type="text"
              placeholder="Name"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
            />
            <input
              type="email"
              placeholder="Email"
              value={customer.email}
              onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
              className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitOrder}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STYLISH ORDER TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
            className="fixed bottom-5 right-5 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 font-semibold"
          >
            <span className="text-2xl animate-bounce">🎉</span>
            {toast}
            <button
              className="ml-3 text-sm underline opacity-70 hover:opacity-100"
              onClick={() => setToast("")}
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
