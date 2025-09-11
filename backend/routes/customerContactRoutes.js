const express = require("express");
const router = express.Router();
const CustomerContact = require("../models/CustomerContact");

// Get all contacts
router.get("/", async (req, res) => {
  try {
    const contacts = await CustomerContact.find().sort({ createdAt: -1 });
    res.json(contacts); // sends JSON array of all contacts
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});


// Add new contact
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const newContact = new CustomerContact({ name, email, phone, message });
    await newContact.save();
    res.status(201).json(newContact);
  } catch (err) {
    res.status(500).json({ error: "Failed to add contact" });
  }
});

// Delete contact
router.delete("/:id", async (req, res) => {
  try {
    await CustomerContact.findByIdAndDelete(req.params.id);
    res.json({ message: "Contact deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete contact" });
  }
});

module.exports = router;
