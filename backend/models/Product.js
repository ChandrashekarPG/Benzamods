// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  description: String,
  price: Number,
  images: [String],
  type: { type: String, enum: ["car", "bike"], required: true }, // ✅ add this
});

module.exports = mongoose.model("Product", productSchema);
