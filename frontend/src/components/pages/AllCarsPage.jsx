import React from "react";

export default function AllCarsPage() {
  const cars = [
    { id: 1, name: "BMW M3", img: "https://images.unsplash.com/photo-1610465299996-df2ec7c2e0c7" },
    { id: 2, name: "Audi R8", img: "https://images.unsplash.com/photo-1606813909479-82a33dcb162d" },
    { id: 3, name: "Lamborghini Huracan", img: "https://images.unsplash.com/photo-1618336753974-17b47779fba0" },
    { id: 4, name: "Mercedes AMG GT", img: "https://images.unsplash.com/photo-1612392061788-c4cc3a0c7db6" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">All Car Modifications</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {cars.map((car) => (
          <div key={car.id} className="shadow-lg rounded-xl overflow-hidden">
            <img src={car.img} alt={car.name} className="w-full h-64 object-cover" />
            <div className="p-4 text-center">
              <h2 className="text-lg font-semibold">{car.name}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
