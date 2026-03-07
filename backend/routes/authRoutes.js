// authRoutes.js
const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile, toggleWishlist, getAllUsers } = require("../controllers/authController");
const { protect, admin } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.put("/wishlist/:productId", protect, toggleWishlist);
router.get("/users", protect, admin, getAllUsers);

module.exports = router;
