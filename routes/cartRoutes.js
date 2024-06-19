const express = require('express');
const { addToCart, getCart, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getCart).post(protect, addToCart).delete(protect, removeFromCart);

module.exports = router;
