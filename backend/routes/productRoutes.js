const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Get all products (with optional filter)
router.get("/", async (req, res) => {
  try {
    const { type } = req.query; // ✅ get type from query
    const filter = type ? { type } : {};
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new product
router.post("/", async (req, res) => {
  try {
    const { name, description, price, category, images, type } = req.body;
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      images,
      type, // ✅ save type
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Delete product
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
