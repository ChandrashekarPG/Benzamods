// routes/enquiryRoutes.js
const express = require("express");
const router = express.Router();
const Enquiry = require("../models/Enquiry");
const authMiddleware = require("../middleware/authMiddleware");

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

module.exports = router;
