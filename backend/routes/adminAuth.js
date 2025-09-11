const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
require('dotenv').config();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const a = await Admin.findOne({ username });
    if (!a) return res.status(400).json({ message: 'Invalid admin creds' });
    const ok = await bcrypt.compare(password, a.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Invalid admin creds' });
    const token = jwt.sign({ id: a._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, admin: { id: a._id, username: a.username, name: a.name } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
