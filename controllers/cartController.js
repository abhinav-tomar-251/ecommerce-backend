const Cart = require('../models/Cart');
const Product = require('../models/Product');

const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        const item = cart.items.find(i => i.product.toString() === productId);

        if (item) {
            item.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
    } else {
        const newCart = new Cart({
            user: req.user._id,
            items: [{ product: productId, quantity }],
        });

        await newCart.save();
    }

    res.status(201).json({ message: 'Product added to cart' });
};

const getCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (cart) {
        res.json(cart);
    } else {
        res.status(404).json({ message: 'Cart not found' });
    }
};

const removeFromCart = async (req, res) => {
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);

        if (itemIndex >= 0) {
            cart.items.splice(itemIndex, 1);
            await cart.save();
            res.json({ message: 'Product removed from cart' });
        } else {
            res.status(404).json({ message: 'Product not found in cart' });
        }
    } else {
        res.status(404).json({ message: 'Cart not found' });
    }
};

module.exports = { addToCart, getCart, removeFromCart };
