// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
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

// CREATE new admin (only admins can add admins)
router.post("/", auth(["admin"]), async (req, res) => {
  try {
    const { username, password, name } = req.body;

    // check existing username
    const existing = await Admin.findOne({ username });
    if (existing) {
      return res.status(400).json({ msg: "Username already taken" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({ username, passwordHash, name });
    await newAdmin.save();

    res.status(201).json({
      msg: "Admin created successfully",
      admin: { _id: newAdmin._id, username: newAdmin.username, name: newAdmin.name },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error while creating admin" });
  }
});

// DELETE admin (only admins can delete admins)
router.delete("/:id", auth(["admin"]), async (req, res) => {
  try {
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

// UPDATE password (self-service for admins)
router.put("/change-password", auth(["admin"]), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ msg: "Both current and new password are required" });
    }

    const admin = await Admin.findById(req.user._id);
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ msg: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    admin.passwordHash = await bcrypt.hash(newPassword, salt);

    await admin.save();
    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ msg: "Server error while updating password" });
  }
});

module.exports = router;
