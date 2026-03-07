# 🛍️ ShopNest — MERN E-Commerce Platform

A production-ready full-stack e-commerce application built with the **MERN stack** (MongoDB, Express, React, Node.js) featuring **Stripe** and **Razorpay** payment gateway integration.

---

## 🚀 Features

| Feature | Details |
|---|---|
| **Auth** | JWT-based register/login, protected routes, role-based access (User/Admin) |
| **Products** | Browsing, search, category filter, sort, pagination, reviews & ratings |
| **Cart** | Persistent cart per user, quantity management |
| **Checkout** | Multi-step checkout with shipping address form |
| **Payments** | Stripe (card), Razorpay (UPI/card/netbanking), Cash on Delivery |
| **Orders** | Full order history, order detail, real-time status tracking |
| **Admin Dashboard** | Manage orders, products, users; update order status |
| **Wishlist** | Save favourite products |

---

## 📁 Project Structure

```
ecommerce-mern/
├── backend/                   # Node.js + Express API
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── seeder.js          # Seed sample data
│   ├── controllers/           # Business logic
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── paymentController.js
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT + admin guard
│   │   └── errorMiddleware.js
│   ├── models/                # Mongoose schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/                # Express routers
│   ├── .env.example
│   └── server.js
│
└── frontend/                  # React + Vite
    └── src/
        ├── components/
        │   ├── Navbar.jsx
        │   ├── ProductCard.jsx
        │   └── ProtectedRoute.jsx
        ├── context/
        │   ├── AuthContext.jsx
        │   └── CartContext.jsx
        ├── pages/
        │   ├── Home.jsx
        │   ├── Products.jsx
        │   ├── ProductDetail.jsx
        │   ├── Cart.jsx
        │   ├── Checkout.jsx    # Stripe + Razorpay
        │   ├── Auth.jsx        # Login + Register
        │   ├── Orders.jsx
        │   └── AdminDashboard.jsx
        ├── services/api.js     # Axios service layer
        ├── App.jsx
        └── index.css           # Design system
```

---

## ⚡ Quick Start

### 1. Clone & install

```bash
# Backend
cd backend
npm install
cp .env.example .env   # fill in your keys

# Frontend
cd ../frontend
npm install
cp .env.example .env   # add Stripe publishable key
```

### 2. Configure `.env` (Backend)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_here

# Stripe (get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # from Stripe CLI

# Razorpay (get from https://dashboard.razorpay.com/app/keys)
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...

CLIENT_URL=http://localhost:5173
```

### 3. Seed sample data

```bash
cd backend
npm run seed
```

This creates:
- **Admin**: `admin@shop.com` / `admin123`
- **User**: `user@shop.com` / `user123`
- 8 sample products

### 4. Run the app

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

App available at: **http://localhost:5173**

---

## 💳 Payment Testing

### Stripe (Test Mode)
```
Card number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/29)
CVC: Any 3 digits
```

### Razorpay (Test Mode)
Use test UPI: `success@razorpay`  
Or test card from [Razorpay docs](https://razorpay.com/docs/payments/payments/test-card-upi-details/)

---

## 🔌 API Reference

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/profile` | Get profile (auth) |
| PUT | `/api/auth/profile` | Update profile (auth) |

### Products
| Method | Route | Description |
|---|---|---|
| GET | `/api/products?keyword=&category=&sort=&page=` | List products |
| GET | `/api/products/featured` | Featured products |
| GET | `/api/products/:id` | Single product |
| POST | `/api/products` | Create (admin) |
| PUT | `/api/products/:id` | Update (admin) |
| DELETE | `/api/products/:id` | Delete (admin) |
| POST | `/api/products/:id/reviews` | Add review (auth) |

### Cart
| Method | Route | Description |
|---|---|---|
| GET | `/api/cart` | Get cart (auth) |
| POST | `/api/cart` | Add/update item (auth) |
| DELETE | `/api/cart/:productId` | Remove item (auth) |
| DELETE | `/api/cart` | Clear cart (auth) |

### Orders
| Method | Route | Description |
|---|---|---|
| POST | `/api/orders` | Create order (auth) |
| GET | `/api/orders/my` | My orders (auth) |
| GET | `/api/orders/:id` | Order detail (auth) |
| GET | `/api/orders` | All orders (admin) |
| PUT | `/api/orders/:id/status` | Update status (admin) |

### Payments
| Method | Route | Description |
|---|---|---|
| POST | `/api/payments/stripe/create-intent` | Create Stripe intent |
| POST | `/api/payments/stripe/webhook` | Stripe webhook |
| POST | `/api/payments/razorpay/create-order` | Create Razorpay order |
| POST | `/api/payments/razorpay/verify` | Verify Razorpay signature |

---

## 🛡️ Tech Stack

**Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs, Stripe SDK, Razorpay SDK  
**Frontend:** React 18, Vite, React Router v6, Axios, Stripe React Elements, react-hot-toast  
**Design:** Custom CSS Design System (Playfair Display + DM Sans, warm editorial palette)

---

## 📦 Deployment

```bash
# Backend: Render / Railway / Heroku
# Frontend: Vercel / Netlify
# Database: MongoDB Atlas (free tier)
```

Set environment variables on your hosting platform. Update `CLIENT_URL` in backend and add `VITE_STRIPE_PUBLISHABLE_KEY` in frontend.

---

*Built as a learning project. Always use test keys in development.*
