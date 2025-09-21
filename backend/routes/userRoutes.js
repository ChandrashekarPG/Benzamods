// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");
const bcrypt = require("bcryptjs");

// ================== Get current logged-in user ==================
router.get("/me", auth(["user"]), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ================== Update profile (user only) ==================
router.put("/update", auth(["user"]), async (req, res) => {
  try {
    const { name, contactNumber, address } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (name) user.name = name;
    if (contactNumber !== undefined) user.contactNumber = contactNumber;
    if (address !== undefined) user.address = address;

    await user.save();

    res.json({
      msg: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        contactNumber: user.contactNumber,
        address: user.address,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ msg: "Server error while updating profile" });
  }
});

// ================== Get all users (admin only) ==================
router.get("/", auth(["admin"]), async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ================== Delete user (admin only) ==================
router.delete("/:id", auth(["admin"]), async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error while deleting user" });
  }
});

// ================== Change password (user only) ==================
router.put("/change-password", auth(["user"]), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ msg: "Both fields are required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ msg: "Current password is incorrect" });
    }

    // Hash and update new password
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error while changing password" });
  }
});

module.exports = router;
