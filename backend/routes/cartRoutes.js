const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

// Add to cart
router.post("/", authMiddleware(["user"]), async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const user = await User.findById(req.user.id).populate("cart.product");
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Check if product already in cart
    const existingItem = user.cart.find(
      (item) => item.product._id.toString() === productId
    );
    if (existingItem) {
      existingItem.qty += quantity;
      await user.save();
      return res.json({ updated: true, cart: user.cart });
    }

    // Add new item
    user.cart.push({ product: productId, qty: quantity });
    await user.save();
    res.json({ updated: false, cart: user.cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get current user's cart
router.get("/", authMiddleware(["user"]), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.product");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user.cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Update quantity of a product in cart
router.put("/:productId", authMiddleware(["user"]), async (req, res) => {
  const { productId } = req.params;
  const { qty } = req.body;

  try {
    const user = await User.findById(req.user.id).populate("cart.product");
    if (!user) return res.status(404).json({ msg: "User not found" });

    const item = user.cart.find(
      (i) => i.product._id.toString() === productId
    );
    if (!item) return res.status(404).json({ msg: "Item not found in cart" });

    if (qty < 1) {
      // remove item if qty < 1
      user.cart = user.cart.filter(
        (i) => i.product._id.toString() !== productId
      );
    } else {
      item.qty = qty;
    }

    await user.save();
    res.json(user.cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Remove product from cart
router.delete("/:productId", authMiddleware(["user"]), async (req, res) => {
  const { productId } = req.params;

  try {
    const user = await User.findById(req.user.id).populate("cart.product");
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.cart = user.cart.filter(
      (item) => item.product._id.toString() !== productId
    );

    await user.save();
    res.json(user.cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
