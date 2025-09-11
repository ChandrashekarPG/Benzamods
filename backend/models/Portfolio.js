  const mongoose = require("mongoose");

  const portfolioSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    category: { type: String, enum: ["Car", "Bike"], required: true },
    brand: String,
    serviceType: String,
    beforeImages: [String], // array of URLs
    afterImages: [String],  // array of URLs
    clientReview: {
      name: String,
      review: String,
      rating: { type: Number, min: 1, max: 5 }
    }
  }, { timestamps: true });

  module.exports = mongoose.model("Portfolio", portfolioSchema);
