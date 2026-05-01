import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const getProductId = (product) => (typeof product === "object" && product !== null) ? product._id : product;

const Cart = () => {
  const { cart, cartTotal, removeFromCart, addToCart } = useCart();
  const items = cart.items || [];

  const tax = +(cartTotal * 0.18).toFixed(2);
  const shipping = cartTotal > 999 ? 0 : 99;
  const total = +(cartTotal + tax + shipping).toFixed(2);

  if (items.length === 0) {
    return (
      <div style={{ paddingTop: 100, minHeight: "80vh" }}>
        <div className="empty-state">
          <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
          </svg>
          <h3>Your cart is empty</h3>
          <p style={{ marginTop: ".5rem" }}>Add some products to get started</p>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: "1.5rem" }}>Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 90, minHeight: "100vh" }}>
      <div style={{ background: "var(--charcoal)", padding: "2.5rem 0" }}>
        <div className="container">
          <h1 style={{ color: "var(--white)" }}>Your Cart</h1>
          <p style={{ color: "rgba(255,255,255,.45)", marginTop: ".25rem" }}>{items.length} item{items.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="container" style={{ padding: "2.5rem 1.5rem", display: "grid", gridTemplateColumns: "1fr 360px", gap: "2.5rem", alignItems: "start" }}>
        {/* Cart items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {items.map(item => {
            const productId = getProductId(item.product);
            return (
            <div key={productId} style={{
              display: "grid", gridTemplateColumns: "100px 1fr auto",
              gap: "1.5rem", alignItems: "center",
              background: "var(--white)", borderRadius: "var(--radius-lg)", padding: "1.25rem",
              boxShadow: "var(--shadow-sm)",
            }}>
              <Link to={`/products/${productId}`}>
                <img src={item.image} alt={item.name} style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: "var(--radius-md)" }} />
              </Link>

              <div>
                <Link to={`/products/${productId}`}>
                  <h3 style={{ fontSize: "1rem", marginBottom: ".25rem" }}>{item.name}</h3>
                </Link>
                <p style={{ fontSize: ".88rem", color: "var(--stone)" }}>₹{item.price.toLocaleString("en-IN")} each</p>

                {/* Qty controls */}
                <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginTop: ".75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", border: "1.5px solid var(--cream-dark)", borderRadius: "var(--radius-full)" }}>
                    <button onClick={() => addToCart(productId, Math.max(1, item.quantity - 1))} style={{ padding: ".35rem .75rem", color: "var(--stone)" }}>−</button>
                    <span style={{ padding: ".35rem .6rem", fontWeight: 600, minWidth: 28, textAlign: "center" }}>{item.quantity}</span>
                    <button onClick={() => addToCart(productId, item.quantity + 1)} style={{ padding: ".35rem .75rem", color: "var(--stone)" }}>+</button>
                  </div>
                  <button onClick={() => removeFromCart(productId)} style={{ color: "var(--rust)", fontSize: ".82rem", fontWeight: 500 }}>Remove</button>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "1.1rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
            );
          })}
        </div>

        {/* Summary */}
        <div style={{ background: "var(--white)", borderRadius: "var(--radius-xl)", padding: "2rem", boxShadow: "var(--shadow-md)", position: "sticky", top: 90 }}>
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.3rem" }}>Order Summary</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem", marginBottom: "1.5rem" }}>
            {[
              ["Subtotal", `₹${cartTotal.toLocaleString("en-IN")}`],
              ["GST (18%)", `₹${tax.toLocaleString("en-IN")}`],
              ["Shipping", shipping === 0 ? "FREE" : `₹${shipping}`],
            ].map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: ".9rem", color: "var(--stone)" }}>
                <span>{label}</span>
                <span style={{ fontWeight: 500, color: val === "FREE" ? "green" : "var(--charcoal)" }}>{val}</span>
              </div>
            ))}
            <div style={{ borderTop: "2px solid var(--cream-dark)", paddingTop: ".75rem", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 600, fontSize: "1rem" }}>Total</span>
              <span style={{ fontWeight: 700, fontSize: "1.2rem", fontFamily: "var(--font-display)" }}>
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
          {cartTotal <= 999 && (
            <p style={{ fontSize: ".78rem", color: "var(--stone)", marginBottom: "1rem", textAlign: "center" }}>
              Add ₹{(999 - cartTotal).toFixed(0)} more for FREE shipping
            </p>
          )}
          <Link to="/checkout" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: ".9rem" }}>
            Proceed to Checkout →
          </Link>
          <Link to="/products" className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", marginTop: ".75rem", fontSize: ".85rem" }}>
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
