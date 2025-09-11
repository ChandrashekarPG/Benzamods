import React from "react";
import { Link } from "react-router-dom";

export default function FooterLinks() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
      <ul className="space-y-2 text-sm">
        <li>
          <Link to="/home" className="hover:text-red-500 transition">Home</Link>
        </li>
        <li>
          <Link to="/services" className="hover:text-red-500 transition">Services</Link>
        </li>
      </ul>
    </div>
  );
}
