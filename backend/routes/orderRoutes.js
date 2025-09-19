const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// ================== Place order ==================
router.post('/place', auth(['user']), async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ message: 'No items in cart' });

    let total = 0;
    const detailedItems = [];

    for (let it of items) {
      const product = await Product.findById(it.productId);
      if (!product)
        return res.status(400).json({ message: 'Invalid product in order' });

      detailedItems.push({
        product: product._id,
        qty: it.qty,
        priceAtOrder: product.price,
      });

      total += product.price * it.qty;
    }

    const order = new Order({
      user: req.user._id,
      items: detailedItems,
      total,
      placedAt: new Date(),
    });

    await order.save();

    // Clear user's cart
    req.user.cart = [];
    await req.user.save();

    res.json({ message: 'Order placed successfully', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ================== Admin: fetch all orders ==================
router.get('/', auth(['admin']), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ================== User: fetch own orders ==================
router.get('/my', auth(['user']), async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      'items.product'
    );
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ================== Admin: delete order by ID ==================
router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// ================== User: delete own order ==================
router.delete('/my/:id', auth(['user']), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check ownership
    if (order.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this order' });
    }

    // Optional: only allow deletion if status = "placed"
    if (order.status !== 'placed') {
      return res
        .status(400)
        .json({ message: 'Only orders with status "placed" can be removed' });
    }

    await order.deleteOne();

    res.json({ message: 'Order removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while deleting order' });
  }
});

module.exports = router;
