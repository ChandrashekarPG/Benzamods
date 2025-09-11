import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { motion } from "framer-motion";

export default function NavbarMobileMenu({
  user,
  onUserLoginClick,
  onAdminLoginClick,
  cartCount,
  goToCart,
  logoutUser,
}) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="md:hidden bg-gray-900 text-gray-300 px-6 py-6 space-y-5 shadow-lg rounded-b-xl"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={containerVariants}
    >
      {/* Navigation Links */}
      <motion.div variants={itemVariants}>
        <Link to="/" className="block text-lg font-medium hover:text-red-500 transition">
          Home
        </Link>
      </motion.div>
      <motion.div variants={itemVariants}>
        <a href="#about" className="block text-lg font-medium hover:text-red-500 transition">
          About
        </a>
      </motion.div>
      <motion.div variants={itemVariants}>
        <Link to="/portfolio" className="block text-lg font-medium hover:text-red-500 transition">
          Portfolio
        </Link>
      </motion.div>

      {/* Cart Icon */}
      <motion.div variants={itemVariants}>
        <button
          onClick={goToCart}
          className="relative flex items-center gap-2 text-yellow-400 hover:text-yellow-300"
        >
          <FaShoppingCart size={22} />
          {cartCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
            >
              {cartCount}
            </motion.span>
          )}
          <span className="ml-2">My Cart</span>
        </button>
      </motion.div>

      {/* User login/logout */}
      <motion.div variants={itemVariants}>
        {user ? (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={logoutUser}
            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white px-5 py-2 rounded-full font-semibold shadow hover:shadow-lg transition"
          >
            Logout User
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={onUserLoginClick}
            className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white px-5 py-2 rounded-full font-semibold shadow hover:shadow-lg transition"
          >
            Login as User
          </motion.button>
        )}
      </motion.div>

      {/* Admin login */}
      <motion.div variants={itemVariants}>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAdminLoginClick}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-5 py-2 rounded-full font-semibold shadow hover:shadow-lg transition"
        >
          Login as Admin
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
