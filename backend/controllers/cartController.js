const asyncHandler = require("express-async-handler");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @desc  Get user cart
// @route GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product", "name images stock");
  res.json(cart || { items: [] });
});

// @desc  Add / update item in cart
// @route POST /api/cart
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.stock < quantity) {
    res.status(400);
    throw new Error(`Only ${product.stock} items in stock`);
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const itemIndex = cart.items.findIndex((i) => i.product.toString() === productId);

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity = quantity;
  } else {
    cart.items.push({
      product: productId,
      name: product.name,
      image: product.images[0] || "",
      price: product.price,
      quantity,
    });
  }

  await cart.save();
  await cart.populate("items.product", "name images stock");
  res.json(cart);
});

// @desc  Remove item from cart
// @route DELETE /api/cart/:productId
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  await cart.save();
  await cart.populate("items.product", "name images stock");
  res.json(cart);
});

// @desc  Clear entire cart
// @route DELETE /api/cart
const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.json({ message: "Cart cleared" });
});

module.exports = { getCart, addToCart, removeFromCart, clearCart };
