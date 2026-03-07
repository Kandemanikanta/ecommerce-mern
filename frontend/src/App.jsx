import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import { Login, Register } from "./pages/Auth";
import { Orders, OrderDetail } from "./pages/Orders";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <main>
            <Routes>
              <Route path="/"               element={<Home />} />
              <Route path="/products"       element={<Products />} />
              <Route path="/products/:id"   element={<ProductDetail />} />
              <Route path="/cart"           element={<Cart />} />
              <Route path="/login"          element={<Login />} />
              <Route path="/register"       element={<Register />} />

              <Route path="/checkout" element={
                <ProtectedRoute><Checkout /></ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute><Orders /></ProtectedRoute>
              } />
              <Route path="/orders/:id" element={
                <ProtectedRoute><OrderDetail /></ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
              } />
            </Routes>
          </main>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { fontFamily: "DM Sans, sans-serif", fontSize: "0.9rem" },
              success: { iconTheme: { primary: "#C9A84C", secondary: "#fff" } },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
