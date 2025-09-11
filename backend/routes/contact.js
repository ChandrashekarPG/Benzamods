const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// POST: save contact form
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();
    res.status(201).json({ message: "Contact form submitted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;
