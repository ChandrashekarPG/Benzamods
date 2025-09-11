// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

// GET all users (admin only)
router.get("/", auth(["admin"]), async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash"); // exclude password
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

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

module.exports = router;
