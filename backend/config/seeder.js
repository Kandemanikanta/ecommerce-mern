const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./db");
const Product = require("../models/Product");
const User = require("../models/User");

dotenv.config();
connectDB();

const sampleProducts = [
  {
    name: "Wireless Noise-Cancelling Headphones",
    description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and superior sound quality.",
    price: 299.99,
    originalPrice: 399.99,
    category: "Electronics",
    brand: "SoundPro",
    stock: 50,
    rating: 4.5,
    numReviews: 128,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"],
    featured: true,
  },
  {
    name: "Minimalist Leather Watch",
    description: "Handcrafted genuine leather strap with sapphire crystal glass and Swiss movement.",
    price: 189.99,
    originalPrice: 189.99,
    category: "Accessories",
    brand: "TimeCraft",
    stock: 30,
    rating: 4.7,
    numReviews: 89,
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"],
    featured: true,
  },
  {
    name: "Ultralight Running Shoes",
    description: "Engineered mesh upper with responsive foam sole for maximum comfort during long runs.",
    price: 129.99,
    originalPrice: 159.99,
    category: "Footwear",
    brand: "SwiftStep",
    stock: 75,
    rating: 4.3,
    numReviews: 204,
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"],
    featured: false,
  },
  {
    name: "Smart Fitness Tracker",
    description: "24/7 health monitoring with heart rate, SpO2, sleep tracking, and 7-day battery life.",
    price: 79.99,
    originalPrice: 99.99,
    category: "Electronics",
    brand: "FitTech",
    stock: 100,
    rating: 4.1,
    numReviews: 315,
    images: ["https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500"],
    featured: true,
  },
  {
    name: "Premium Yoga Mat",
    description: "6mm thick non-slip natural rubber mat with alignment guides and carrying strap.",
    price: 59.99,
    originalPrice: 59.99,
    category: "Sports",
    brand: "ZenFlow",
    stock: 60,
    rating: 4.6,
    numReviews: 172,
    images: ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500"],
    featured: false,
  },
  {
    name: "Mechanical Gaming Keyboard",
    description: "TKL layout with Cherry MX Blue switches, RGB backlight, and aluminum frame.",
    price: 149.99,
    originalPrice: 179.99,
    category: "Electronics",
    brand: "KeyForce",
    stock: 45,
    rating: 4.8,
    numReviews: 96,
    images: ["https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500"],
    featured: false,
  },
  {
    name: "Insulated Travel Tumbler",
    description: "40oz double-wall vacuum insulation keeps drinks cold 24hrs or hot 12hrs. BPA-free.",
    price: 34.99,
    originalPrice: 44.99,
    category: "Lifestyle",
    brand: "HydroVault",
    stock: 200,
    rating: 4.9,
    numReviews: 540,
    images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500"],
    featured: true,
  },
  {
    name: "Wireless Charging Pad",
    description: "15W fast wireless charger compatible with all Qi-enabled devices. Slim, anti-slip design.",
    price: 29.99,
    originalPrice: 39.99,
    category: "Electronics",
    brand: "ChargeFast",
    stock: 120,
    rating: 4.2,
    numReviews: 231,
    images: ["https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500"],
    featured: false,
  },
];

const seedData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    // Create admin user (password hashed automatically by User model pre-save hook)
    await User.create({
      name: "Admin User",
      email: "admin@shop.com",
      password: "admin123",
      role: "admin",
    });

    // Create test user (password hashed automatically by User model pre-save hook)
    await User.create({
      name: "Test User",
      email: "user@shop.com",
      password: "user123",
      role: "user",
    });

    await Product.insertMany(sampleProducts);

    console.log("✅ Data seeded successfully!");
    console.log("Admin: admin@shop.com / admin123");
    console.log("User:  user@shop.com / user123");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedData();
