import React from "react";
import AboutImage from "./AboutImage";
import AboutContent from "./AboutContent";

export default function AboutUs() {
  return (
    <section id="about" className="py-20 bg-black text-red-500">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <AboutImage
          src="https://images.moneycontrol.com/static-mcnews/2024/09/20240917103826_Triumph.jpg?impolicy=website&width=770&height=431"
          alt="About Benzamods"
        />
        <AboutContent />
      </div>
    </section>
  );
}
