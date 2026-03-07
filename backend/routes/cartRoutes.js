// cartRoutes.js
const express = require("express");
const r = express.Router();
const { getCart, addToCart, removeFromCart, clearCart } = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

r.get("/",                    protect, getCart);
r.post("/",                   protect, addToCart);
r.delete("/",                 protect, clearCart);
r.delete("/:productId",       protect, removeFromCart);

module.exports = r;
