import React, { useState } from "react";
import axios from "axios";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "", category: "", type: "car", description: "", price: "", images: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/products", product);
      alert("Product added!");
      setProduct({ name: "", category: "", type: "car", description: "", price: "", images: [] });
    } catch (err) {
      console.error(err);
      alert("Error adding product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      <input type="text" placeholder="Name" value={product.name} onChange={e => setProduct({...product, name: e.target.value})} className="border p-2 w-full mb-2" />
      <input type="text" placeholder="Category" value={product.category} onChange={e => setProduct({...product, category: e.target.value})} className="border p-2 w-full mb-2" />
      <select value={product.type} onChange={e => setProduct({...product, type: e.target.value})} className="border p-2 w-full mb-2">
        <option value="car">Car</option>
        <option value="bike">Bike</option>
      </select>
      <textarea placeholder="Description" value={product.description} onChange={e => setProduct({...product, description: e.target.value})} className="border p-2 w-full mb-2" />
      <input type="number" placeholder="Price" value={product.price} onChange={e => setProduct({...product, price: e.target.value})} className="border p-2 w-full mb-2" />
      <input type="text" placeholder="Image URL (comma separated)" value={product.images} onChange={e => setProduct({...product, images: e.target.value.split(",")})} className="border p-2 w-full mb-2" />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Add Product</button>
    </form>
  );
};

export default AddProduct;
