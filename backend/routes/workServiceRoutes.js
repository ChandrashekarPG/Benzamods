const express = require("express");
const router = express.Router();
const WorkService = require("../models/WorkService");

router.get("/", async (req, res) => {
  const services = await WorkService.find();
  res.json(services);
});

router.post("/", async (req, res) => {
  const newService = new WorkService(req.body);
  await newService.save();
  res.json(newService);
});

router.put("/:id", async (req, res) => {
  const updated = await WorkService.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  await WorkService.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
