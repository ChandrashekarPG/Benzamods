import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavbarLogo from "./NavbarLogo";
import NavbarDesktopMenu from "./NavbarDesktopMenu";
import NavbarMobileMenu from "./NavbarMobileMenu";
import HamburgerButton from "./HamburgerButton";
import LoginModal from "./LoginModal";
import { useAuth } from "../context/AuthContext";
import api from "./api";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(null); 
  const [cartCount, setCartCount] = useState(0);

  const { user, admin, token, requireUserLogin, logoutUser, handleLoginSuccess } =
    useAuth();

  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const fetchCartCount = async () => {
    if (!user || !token) return setCartCount(0);
    try {
      const res = await api.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartCount(res.data.length);
    } catch (err) {
      console.error("Error fetching cart count:", err);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [user]);

  const goToCart = () => requireUserLogin(() => navigate("/cart"));

  // Login success callback
  const onLoginSuccess = (role, loggedInObj, receivedToken) => {
    handleLoginSuccess(role, loggedInObj, receivedToken);

    if (role === "admin") {
      navigate("/admin"); // navigate admin
    }
  };

  return (
    <nav className="fixed w-full top-0 left-0 z-50 bg-black bg-opacity-90 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <NavbarLogo />

        <div className="flex items-center gap-4">
          <NavbarDesktopMenu
            user={user}
            onUserLoginClick={() => setShowLogin("user")}
            onAdminLoginClick={() => setShowLogin("admin")}
            cartCount={cartCount}
            goToCart={goToCart}
            logoutUser={logoutUser}
          />

          {/* ✅ Show My Profile button if logged in */}
          {user && (
  <button
    onClick={() => navigate("/profile")}
    className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-transform"
  >
    {user.name ? `Hi, ${user.name.split(" ")[0]}` : "My Profile"}
  </button>
)}

        </div>

        <HamburgerButton isOpen={isOpen} toggle={toggleMenu} />
      </div>

      {isOpen && (
        <NavbarMobileMenu
          user={user}
          onUserLoginClick={() => setShowLogin("user")}
          onAdminLoginClick={() => setShowLogin("admin")}
          cartCount={cartCount}
          goToCart={goToCart}
          logoutUser={logoutUser}
        />
      )}

      <LoginModal
        isOpen={!!showLogin}
        role={showLogin}
        onClose={() => setShowLogin(null)}
        onSuccess={onLoginSuccess}
      />
    </nav>
  );
}
