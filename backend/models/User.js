const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  qty: { type: Number, default: 1 },
  addedAt: { type: Date, default: Date.now }
});

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'user' }, // 'user'
  contactNumber: { type: String, required: true },  // ✅ mandatory
  address: { type: String, required: true },        // ✅ mandatory
  cart: [CartItemSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
