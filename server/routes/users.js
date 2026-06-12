const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

/**
 * GET /api/users/profile
 * Get the authenticated user's profile
 */
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user.toJSON());
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile.', error: error.message });
  }
});

/**
 * PUT /api/users/update-profile
 * Update the authenticated user's name and/or password
 * Body: { name?, password? }
 */
router.put('/update-profile', authMiddleware, async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (name) {
      user.name = name;
    }

    // If new password provided, hash it before saving
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters.' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ message: 'Profile updated successfully.', user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile.', error: error.message });
  }
});

/**
 * PUT /api/users/wishlist
 * Sync wishlist for the authenticated user
 * Body: { wishlist: [{productId, title, price, image, category}] }
 */
router.put('/wishlist', authMiddleware, async (req, res) => {
  try {
    const { wishlist } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.wishlist = wishlist || [];
    await user.save();
    res.json({ message: 'Wishlist updated.', wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Error updating wishlist.', error: error.message });
  }
});

/**
 * GET /api/users/wishlist
 * Get the authenticated user's wishlist
 */
router.get('/wishlist', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist.', error: error.message });
  }
});

/**
 * GET /api/users/count
 * Get total user count (admin only) — for admin dashboard
 */
router.get('/count', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ totalUsers: count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user count.', error: error.message });
  }
});

module.exports = router;
