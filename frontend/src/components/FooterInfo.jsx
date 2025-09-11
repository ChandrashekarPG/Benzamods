import React from "react";
import logo from "../assets/logo.png";

export default function FooterInfo() {
  return (
    <div className="flex flex-col items-start">
      <div className="flex items-center gap-3 mb-4">
        <img src={logo} alt="Benzamods Logo" className="w-10 h-10" />
        <h2 className="text-2xl font-bold text-white">Benzamods</h2>
      </div>
      <p className="text-sm leading-relaxed text-gray-400">
        Transforming cars & bikes with premium modifications, stylish accessories, 
        and top-notch service. 🚗🏍️
      </p>
    </div>
  );
}
