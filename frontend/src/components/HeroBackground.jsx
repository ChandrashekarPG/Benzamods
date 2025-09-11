import React from "react";

export default function HeroBackground({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 w-full h-full object-cover opacity-40"
    />
  );
}
