import axios from "axios";

const API = axios.create({ baseURL: "/api" });

// Attach token from localStorage
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth
export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);
export const getProfile = () => API.get("/auth/profile");
export const updateProfile = (data) => API.put("/auth/profile", data);
export const toggleWishlist = (id) => API.put(`/auth/wishlist/${id}`);
export const getAllUsers = () => API.get("/auth/users");

// Products
export const getProducts = (params) => API.get("/products", { params });
export const getFeaturedProducts = () => API.get("/products/featured");
export const getProductById = (id) => API.get(`/products/${id}`);
export const getCategories = () => API.get("/products/categories");
export const createProduct = (data) => API.post("/products", data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const createReview = (id, data) => API.post(`/products/${id}/reviews`, data);

// Cart
export const getCart = () => API.get("/cart");
export const addToCart = (data) => API.post("/cart", data);
export const removeFromCart = (productId) => API.delete(`/cart/${productId}`);
export const clearCart = () => API.delete("/cart");

// Orders
export const createOrder = (data) => API.post("/orders", data);
export const getMyOrders = () => API.get("/orders/my");
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const getAllOrders = () => API.get("/orders");
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });

// Payments
export const createStripeIntent = (orderId) => API.post("/payments/stripe/create-intent", { orderId });
export const createRazorpayOrder = (orderId) => API.post("/payments/razorpay/create-order", { orderId });
export const verifyRazorpayPayment = (data) => API.post("/payments/razorpay/verify", data);

export default API;
