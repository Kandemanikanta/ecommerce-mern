const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");

// ─────────────────────────────────────────
// STRIPE
// ─────────────────────────────────────────

// @desc  Create Stripe PaymentIntent
// @route POST /api/payments/stripe/create-intent
const createStripeIntent = asyncHandler(async (req, res) => {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalPrice * 100), // in paise/cents
    currency: "inr",
    metadata: { orderId: orderId.toString(), userId: req.user._id.toString() },
  });

  res.json({ clientSecret: paymentIntent.client_secret });
});

// @desc  Stripe webhook — confirm payment
// @route POST /api/payments/stripe/webhook
const stripeWebhook = asyncHandler(async (req, res) => {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    const order = await Order.findById(intent.metadata.orderId);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.status = "processing";
      order.paymentResult = { id: intent.id, status: "succeeded", update_time: new Date().toISOString() };
      await order.save();
    }
  }

  res.json({ received: true });
});

// ─────────────────────────────────────────
// RAZORPAY
// ─────────────────────────────────────────

// @desc  Create Razorpay order
// @route POST /api/payments/razorpay/create-order
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const Razorpay = require("razorpay");
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const razorpayOrder = await instance.orders.create({
    amount: Math.round(order.totalPrice * 100),
    currency: "INR",
    receipt: orderId.toString(),
    notes: { userId: req.user._id.toString() },
  });

  res.json({
    id: razorpayOrder.id,
    currency: razorpayOrder.currency,
    amount: razorpayOrder.amount,
    key: process.env.RAZORPAY_KEY_ID,
  });
});

// @desc  Verify Razorpay payment signature
// @route POST /api/payments/razorpay/verify
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const crypto = require("crypto");
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    res.status(400);
    throw new Error("Invalid payment signature");
  }

  const order = await Order.findById(orderId);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = "processing";
    order.paymentResult = { id: razorpay_payment_id, status: "captured", update_time: new Date().toISOString() };
    await order.save();
  }

  res.json({ message: "Payment verified successfully", orderId });
});

module.exports = { createStripeIntent, stripeWebhook, createRazorpayOrder, verifyRazorpayPayment };
