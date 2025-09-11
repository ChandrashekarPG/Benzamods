const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // ✅ important

// Register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role || "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role || "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { registerUser, loginUser };