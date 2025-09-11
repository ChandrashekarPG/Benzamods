import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavbarLogo from "./NavbarLogo";
import NavbarDesktopMenu from "./NavbarDesktopMenu";
import NavbarMobileMenu from "./NavbarMobileMenu";
import HamburgerButton from "./HamburgerButton";
import LoginModal from "./LoginModal";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

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
      const res = await axios.get("http://localhost:5000/api/cart", {
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

        <NavbarDesktopMenu
          user={user}
          onUserLoginClick={() => setShowLogin("user")}
          onAdminLoginClick={() => setShowLogin("admin")}
          cartCount={cartCount}
          goToCart={goToCart}
          logoutUser={logoutUser}
        />

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
