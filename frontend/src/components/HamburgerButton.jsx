import React from "react";
import { Menu, X } from "lucide-react";

export default function HamburgerButton({ isOpen, toggle }) {
  return (
    <button 
      className="md:hidden text-gray-300"
      onClick={toggle}
    >
      {isOpen ? <X size={28}/> : <Menu size={28}/>}
    </button>
  );
}
