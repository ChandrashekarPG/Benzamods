const mongoose = require("mongoose");

const WorkServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  serviceType: { type: String, required: true },
  description: String,
  price: Number,
  image: String
}, { timestamps: true });

module.exports = mongoose.model("WorkService", WorkServiceSchema);
