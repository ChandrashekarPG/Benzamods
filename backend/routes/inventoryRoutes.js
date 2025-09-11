// routes/inventoryRoutes.js
const express = require("express");
const Inventory = require("../models/Inventory");

const router = express.Router();

// GET all items
router.get("/", async (req, res) => {
  const items = await Inventory.find();
  res.json(items);
});

// POST new item
router.post("/", async (req, res) => {
  const newItem = new Inventory(req.body);
  await newItem.save();
  res.status(201).json(newItem);
});

// PUT update item
router.put("/:id", async (req, res) => {
  const updated = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE item
router.delete("/:id", async (req, res) => {
  await Inventory.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
