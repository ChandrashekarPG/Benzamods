import React from "react";
import HeroBackground from "./HeroBackground";
import HeroOverlay from "./HeroOverlay";
import HeroContent from "./HeroContent";

export default function HeroBanner() {
  return (
    <section className="relative h-[90vh] flex items-center justify-center text-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <HeroBackground src="https://images.unsplash.com/photo-1503376780353-7e6692767b70" alt="Luxury Car" />
      <HeroOverlay />
      <HeroContent />
    </section>
  );
}
