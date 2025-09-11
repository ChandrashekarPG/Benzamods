// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const auth = require("../middleware/authMiddleware");

// GET all admins (admin only)
router.get("/", auth(["admin"]), async (req, res) => {
  try {
    const admins = await Admin.find().select("-passwordHash"); // exclude password
    res.json(admins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// DELETE admin (only admins can delete admins)
router.delete("/:id", auth(["admin"]), async (req, res) => {
  try {
    // prevent self-deletion
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ msg: "You cannot delete yourself" });
    }

    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    res.json({ msg: "Admin deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error while deleting admin" });
  }
});

module.exports = router;
