const express = require("express");
const router = express.Router();
const Portfolio = require("../models/Portfolio");

// GET all portfolios
router.get("/", async (req, res) => {
  try {
    const portfolios = await Portfolio.find();
    res.json(portfolios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET one portfolio by ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Portfolio.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: "Not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// CREATE portfolio
router.post("/", async (req, res) => {
  try {
    const newPortfolio = new Portfolio(req.body);
    await newPortfolio.save();
    res.json(newPortfolio);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE portfolio
router.put("/:id", async (req, res) => {
  try {
    const updated = await Portfolio.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE portfolio
router.delete("/:id", async (req, res) => {
  try {
    await Portfolio.findByIdAndDelete(req.params.id);
    res.json({ message: "Portfolio deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
