
import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // adjust path if needed

export default function NavbarLogo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img
        src={logo}
        alt="Benzamods Logo"
        className="h-10 w-auto object-contain drop-shadow-md"
      />
      <span className="hidden md:block text-2xl font-bold text-red-500">
        Benzamods
      </span>
    </Link>
  );
}
