const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const User = require('../models/User');
const auth = require('../middleware/auth');

// list admins (admins only)
router.get('/list', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });
  const admins = await Admin.find({}, '-passwordHash');
  res.json(admins);
});

// list users (admins only)
router.get('/users', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });
  const users = await User.find({}, '-passwordHash').sort({ createdAt: -1 });
  res.json(users);
});

module.exports = router;
