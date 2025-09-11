const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  username: { type: String, required: true, unique: true },
  // store hashed password
  passwordHash: { type: String, required: true },
  name: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', AdminSchema);
