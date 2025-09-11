const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Admin signup
    if (role === "admin") {
      const existingAdmin = await Admin.findOne({ username: email });
      if (existingAdmin) return res.status(400).json({ msg: "Admin already exists" });

      const passwordHash = await bcrypt.hash(password, 10);

      const newAdmin = new Admin({
        username: email,
        name,
        passwordHash,
        role: "admin",
      });

      await newAdmin.save();

      // Auto-generate token for admin login
      const token = jwt.sign({ id: newAdmin._id, role: "admin" }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.status(201).json({
        msg: "Admin created successfully",
        user: newAdmin,
        token,
      });
    }

    // Normal user signup
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      passwordHash,
      role: "user",
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: "user" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      msg: "User created successfully",
      user: newUser,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Login route (User/Admin)
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user;

    if (role === "admin") {
      user = await Admin.findOne({ username: email });
    } else {
      user = await User.findOne({ email });
    }

    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
