const express = require('express');
const { createOrder, payOrder } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.route('/').post(protect, createOrder);
router.route('/pay').post(protect, payOrder);

module.exports = router;
