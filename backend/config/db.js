// backend/config/db.js
const mongoose = require("mongoose");

const connectDB = async (mongoUri) => {
  const MONGO_URI = mongoUri || process.env.MONGO_URI;
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
