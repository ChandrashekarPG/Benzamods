import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { motion } from "framer-motion";

export default function NavbarDesktopMenu({
  user,
  onUserLoginClick,
  onAdminLoginClick,
  cartCount,
  goToCart,
  logoutUser,
}) {
  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "#about", isAnchor: true },
    { label: "Portfolio", path: "/portfolio" },
  ];

  return (
    <ul className="hidden md:flex gap-8 text-gray-300 font-medium items-center">
      {/* Navigation Links */}
      {navLinks.map((link, idx) => (
        <li key={idx} className="relative group">
          {link.isAnchor ? (
            <a
              href={link.path}
              className="transition text-lg tracking-wide"
            >
              {link.label}
            </a>
          ) : (
            <Link
              to={link.path}
              className="transition text-lg tracking-wide"
            >
              {link.label}
            </Link>
          )}
          {/* Underline effect */}
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-red-500 to-yellow-400 transition-all group-hover:w-full"></span>
        </li>
      ))}

      {/* Cart Icon */}
      <li>
        <motion.button
          onClick={goToCart}
          whileTap={{ scale: 0.9 }}
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
        </motion.button>
      </li>

      {/* User login/logout */}
      {user ? (
        <li>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logoutUser}
            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transition"
          >
            Logout User
          </motion.button>
        </li>
      ) : (
        <li>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onUserLoginClick}
            className="bg-gradient-to-r from-red-600 to-red-500 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transition"
          >
            Login as User
          </motion.button>
        </li>
      )}

      {/* Admin login */}
      <li>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAdminLoginClick}
          className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transition"
        >
          Login as Admin
        </motion.button>
      </li>
    </ul>
  );
}
