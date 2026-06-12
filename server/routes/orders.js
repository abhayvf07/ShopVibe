const express = require('express');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

/**
 * POST /api/orders/place-order
 * Place a new order (authenticated users only)
 * Body: { items: [{productId, title, price, quantity, image}], totalAmount }
 */
router.post('/place-order', authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item.' });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ message: 'Invalid order total.' });
    }

    const order = new Order({
      userId: req.user.id,
      items,
      totalAmount,
      status: 'Pending'
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error placing order.', error: error.message });
  }
});

/**
 * GET /api/orders/my-orders
 * Get all orders for the authenticated user, sorted newest first
 */
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders.', error: error.message });
  }
});

/**
 * GET /api/orders/all
 * Get all orders (admin only) — for admin panel stats
 */
router.get('/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all orders.', error: error.message });
  }
});

/**
 * GET /api/orders/stats
 * Get order statistics (admin only) — for admin dashboard cards
 */
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const revenueResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.json({
      totalOrders,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats.', error: error.message });
  }
});

module.exports = router;
