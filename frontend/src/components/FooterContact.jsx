import React from "react";
import { Phone, MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function FooterContact() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
      <ul className="space-y-2 text-sm">
        <li className="flex items-center gap-2">
          <Phone size={16} /> +91 98765 43210
        </li>
        <li className="flex items-center gap-2">
          <MapPin size={16} /> 123 Car Street, Bangalore, India
        </li>
      </ul>

      {/* WhatsApp link with text */}
      <div className="flex items-center gap-2 mt-4">
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-green-500 transition"
        >
          <FaWhatsapp size={24} />
          <span className="text-sm">Chat on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
