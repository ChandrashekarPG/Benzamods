require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import routes
const contactRoute = require("./routes/contact");
const inventoryRoutes = require("./routes/inventoryRoutes");
const workServiceRoutes = require("./routes/workServiceRoutes");
const customerContactRoutes = require("./routes/customerContactRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const servicesRoutes = require("./routes/servicesRoutes");

// ✅ Newly added routes for Auth, Products, Cart, Orders
const authRoutes = require("./routes/authRoutes");  // User + Admin login/signup
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");

// allow frontend on Vercel + localhost
const allowedOrigins = [
  process.env.FRONTEND_URL,   // set this in Render, e.g. https://your-frontend.vercel.app
  "http://localhost:3000"
].filter(Boolean);

// Initialize Express
const app = express();

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
connectDB(process.env.MONGO_URI);

// Routes
app.use("/api/contact", contactRoute);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/services", workServiceRoutes);
app.use("/api/contacts", customerContactRoutes);
app.use("/api/portfolios", portfolioRoutes);
app.use("/api/services", servicesRoutes);

// ✅ User & Admin authentication
app.use("/auth", authRoutes);

// ✅ Product Management (Admin adds products, users browse them)
app.use("/api/products", productRoutes);

// ✅ Cart Management (User only)
app.use("/api/cart", cartRoutes);

// ✅ Orders Management (User places order, Admin views all orders)
app.use("/api/orders", orderRoutes);

app.use("/api/users", userRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/enquiries", enquiryRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// health check for Render
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
