import { createContext, useContext, useState, useEffect } from "react";
import { getCart, addToCart as addAPI, removeFromCart as removeAPI, clearCart as clearAPI } from "../services/api";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) { setCart({ items: [] }); return; }
    try {
      const { data } = await getCart();
      setCart(data);
    } catch (err) {
      console.error("Cart fetch error:", err);
    }
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) { toast.error("Please login to add items"); return; }
    setCartLoading(true);
    try {
      const { data } = await addAPI({ productId, quantity });
      setCart(data);
      toast.success("Added to cart!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add to cart");
    } finally {
      setCartLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    setCartLoading(true);
    try {
      const { data } = await removeAPI(productId);
      setCart(data);
    } catch (err) {
      toast.error("Could not remove item");
    } finally {
      setCartLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      await clearAPI();
      setCart({ items: [] });
    } catch (err) {
      console.error(err);
    }
  };

  const cartCount = cart.items?.reduce((acc, i) => acc + i.quantity, 0) || 0;
  const cartTotal = cart.items?.reduce((acc, i) => acc + i.price * i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartCount, cartTotal, cartLoading, addToCart, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
