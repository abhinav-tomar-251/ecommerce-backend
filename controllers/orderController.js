const Order = require('../models/Order');
const Cart = require('../models/Cart');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createOrder = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    const totalPrice = cart.items.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

    const order = new Order({
        user: req.user._id,
        items: cart.items,
        totalPrice,
    });

    const createdOrder = await order.save();

    cart.items = [];
    await cart.save();

    res.status(201).json(createdOrder);
};

const payOrder = async (req, res) => {
    const { orderId, paymentMethodId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: order.totalPrice * 100,
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true,
    });

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
        id: paymentIntent.id,
        status: paymentIntent.status,
        update_time: paymentIntent.created,
        email_address: req.user.email,
    };

    await order.save();

    res.json({ message: 'Payment successful', order });
};

module.exports = { createOrder, payOrder };
