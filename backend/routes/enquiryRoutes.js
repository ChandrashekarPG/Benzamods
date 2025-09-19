// routes/enquiryRoutes.js
const express = require("express");
const router = express.Router();
const Enquiry = require("../models/Enquiry");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ User can submit enquiry
router.post("/", authMiddleware(["user"]), async (req, res) => {
  try {
    const { name, email, phone, message, productId, userId } = req.body;

    const enquiry = new Enquiry({
      name,
      email,
      phone,
      message,
      product: productId,
      user: userId,
    });

    await enquiry.save();
    res.status(201).json(enquiry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to submit enquiry" });
  }
});

// ✅ Admin: Get all enquiries
router.get("/", authMiddleware(["admin"]), async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .populate("product", "name")
      .populate("user", "name email");
    res.json(enquiries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch enquiries" });
  }
});

// ✅ Admin: Delete an enquiry
router.delete("/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ msg: "Enquiry not found" });
    res.json({ msg: "Enquiry deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to delete enquiry" });
  }
});

module.exports = router;
