import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createOrder, createStripeIntent, createRazorpayOrder, verifyRazorpayPayment } from "../services/api";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder");

const CARD_STYLE = {
  style: {
    base: { fontSize: "16px", color: "#1C1917", fontFamily: "DM Sans, sans-serif", "::placeholder": { color: "#A8A29E" } },
    invalid: { color: "#C44B2B" },
  },
};

const StripeForm = ({ orderId, amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    try {
      const { data } = await createStripeIntent(orderId);
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });
      if (result.error) throw new Error(result.error.message);
      if (result.paymentIntent.status === "succeeded") {
        onSuccess({ id: result.paymentIntent.id, status: "succeeded" });
      }
    } catch (err) {
      toast.error(err.message || "Payment failed");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ border: "1.5px solid var(--cream-dark)", borderRadius: "var(--radius-md)", padding: "1rem", marginBottom: "1rem", background: "var(--white)" }}>
        <CardElement options={CARD_STYLE} />
      </div>
      <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: ".9rem" }} disabled={loading || !stripe}>
        {loading ? "Processing…" : `Pay ₹${amount.toLocaleString("en-IN")}`}
      </button>
      <p style={{ textAlign: "center", fontSize: ".75rem", color: "var(--stone)", marginTop: ".75rem" }}>
        🔒 Test card: 4242 4242 4242 4242 · Any future date · Any CVC
      </p>
    </form>
  );
};

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: address, 2: payment
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [createdOrderId, setCreatedOrderId] = useState(null);
  const [loading, setLoading] = useState(false);

  const tax = +(cartTotal * 0.18).toFixed(2);
  const shipping = cartTotal > 999 ? 0 : 99;
  const total = +(cartTotal + tax + shipping).toFixed(2);

  const [address, setAddress] = useState({ street: "", city: "", state: "", zip: "", country: "India" });
  const handleAddressChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await createOrder({ shippingAddress: address, paymentMethod });
      setCreatedOrderId(data._id);
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create order");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentResult) => {
    await clearCart();
    toast.success("Payment successful! 🎉");
    navigate(`/orders/${createdOrderId}?success=1`);
  };

  const handleRazorpay = async () => {
    setLoading(true);
    try {
      const { data } = await createRazorpayOrder(createdOrderId);
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "ShopNest",
        description: "Order Payment",
        order_id: data.id,
        handler: async (response) => {
          try {
            await verifyRazorpayPayment({ ...response, orderId: createdOrderId });
            await clearCart();
            toast.success("Payment successful! 🎉");
            navigate(`/orders/${createdOrderId}?success=1`);
          } catch {
            toast.error("Payment verification failed");
          }
        },
        prefill: { name: "", email: "" },
        theme: { color: "#C9A84C" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Could not initiate payment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cart.items?.length === 0 && !createdOrderId) {
      navigate("/cart");
    }
  }, [cart.items, createdOrderId, navigate]);

  useEffect(() => {
    if (!window.Razorpay && paymentMethod === "razorpay") {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
      return () => document.body.removeChild(script);
    }
  }, [paymentMethod]);

  if (cart.items?.length === 0 && !createdOrderId) {
    return null;
  }

  return (
    <div style={{ paddingTop: 90, minHeight: "100vh" }}>
      <div style={{ background: "var(--charcoal)", padding: "2.5rem 0" }}>
        <div className="container">
          <h1 style={{ color: "var(--white)" }}>Checkout</h1>
          <div style={{ display: "flex", gap: "1rem", marginTop: ".75rem", alignItems: "center" }}>
            {["Shipping", "Payment", "Done"].map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: step > i + 1 ? "var(--gold)" : step === i + 1 ? "var(--white)" : "rgba(255,255,255,.2)",
                  color: step === i + 1 ? "var(--charcoal)" : step > i + 1 ? "var(--charcoal)" : "rgba(255,255,255,.5)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: ".8rem", fontWeight: 700,
                }}>{step > i + 1 ? "✓" : i + 1}</div>
                <span style={{ fontSize: ".8rem", color: step === i + 1 ? "var(--white)" : "rgba(255,255,255,.4)" }}>{s}</span>
                {i < 2 && <span style={{ color: "rgba(255,255,255,.2)", margin: "0 .25rem" }}>›</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "2.5rem 1.5rem", display: "grid", gridTemplateColumns: "1fr 360px", gap: "2.5rem", alignItems: "start" }}>
        <div>
          {step === 1 && (
            <div style={{ background: "var(--white)", borderRadius: "var(--radius-xl)", padding: "2rem", boxShadow: "var(--shadow-sm)" }}>
              <h2 style={{ marginBottom: "1.5rem" }}>Shipping Address</h2>
              <form onSubmit={handleAddressSubmit}>
                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input name="street" value={address.street} onChange={handleAddressChange} required className="form-input" placeholder="123 MG Road" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input name="city" value={address.city} onChange={handleAddressChange} required className="form-input" placeholder="Bangalore" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input name="state" value={address.state} onChange={handleAddressChange} required className="form-input" placeholder="Karnataka" />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label">PIN Code</label>
                    <input name="zip" value={address.zip} onChange={handleAddressChange} required className="form-input" placeholder="560001" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <input name="country" value={address.country} onChange={handleAddressChange} className="form-input" />
                  </div>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label className="form-label" style={{ marginBottom: ".75rem", display: "block" }}>Payment Method</label>
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    {[["stripe", "💳 Stripe (Card)"], ["razorpay", "🏦 Razorpay (UPI/Card)"], ["cod", "📦 Cash on Delivery"]].map(([val, label]) => (
                      <label key={val} style={{
                        display: "flex", alignItems: "center", gap: ".5rem",
                        padding: ".75rem 1.25rem", borderRadius: "var(--radius-md)",
                        border: `1.5px solid ${paymentMethod === val ? "var(--charcoal)" : "var(--cream-dark)"}`,
                        cursor: "pointer", fontSize: ".88rem",
                        background: paymentMethod === val ? "var(--charcoal)" : "var(--white)",
                        color: paymentMethod === val ? "var(--white)" : "var(--charcoal)",
                        transition: "all .15s",
                      }}>
                        <input type="radio" name="payment" value={val} checked={paymentMethod === val} onChange={e => setPaymentMethod(e.target.value)} style={{ display: "none" }} />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: ".9rem" }} disabled={loading}>
                  {loading ? "Processing…" : "Continue to Payment →"}
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div style={{ background: "var(--white)", borderRadius: "var(--radius-xl)", padding: "2rem", boxShadow: "var(--shadow-sm)" }}>
              <h2 style={{ marginBottom: "1.5rem" }}>
                {paymentMethod === "stripe" ? "Card Payment" : paymentMethod === "razorpay" ? "Razorpay" : "Cash on Delivery"}
              </h2>
              {paymentMethod === "stripe" && (
                <Elements stripe={stripePromise}>
                  <StripeForm orderId={createdOrderId} amount={total} onSuccess={handlePaymentSuccess} />
                </Elements>
              )}
              {paymentMethod === "razorpay" && (
                <div>
                  <p style={{ color: "var(--stone)", marginBottom: "1.5rem" }}>
                    You'll be redirected to Razorpay to complete your payment securely.
                  </p>
                  <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: ".9rem" }} onClick={handleRazorpay} disabled={loading}>
                    {loading ? "Loading…" : `Pay ₹${total.toLocaleString("en-IN")} via Razorpay`}
                  </button>
                </div>
              )}
              {paymentMethod === "cod" && (
                <div>
                  <p style={{ color: "var(--stone)", marginBottom: "1.5rem" }}>Pay ₹{total.toLocaleString("en-IN")} when your order is delivered.</p>
                  <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: ".9rem" }} onClick={() => handlePaymentSuccess({ status: "cod" })}>
                    Confirm Order (COD)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Summary sidebar */}
        <div style={{ background: "var(--white)", borderRadius: "var(--radius-xl)", padding: "1.75rem", boxShadow: "var(--shadow-md)", position: "sticky", top: 90 }}>
          <h3 style={{ marginBottom: "1.25rem" }}>Summary</h3>
          {cart.items?.slice(0, 3).map(item => (
            <div key={item.product} style={{ display: "flex", gap: ".75rem", alignItems: "center", marginBottom: ".75rem" }}>
              <img src={item.image} alt={item.name} style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", objectFit: "cover" }} />
              <div style={{ flex: 1, fontSize: ".82rem" }}>
                <p style={{ fontWeight: 500 }}>{item.name.slice(0, 28)}{item.name.length > 28 ? "…" : ""}</p>
                <p style={{ color: "var(--stone)" }}>×{item.quantity}</p>
              </div>
              <span style={{ fontSize: ".88rem", fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid var(--cream-dark)", paddingTop: "1rem", marginTop: ".5rem" }}>
            {[["Subtotal", `₹${cartTotal.toLocaleString()}`], ["Tax", `₹${tax}`], ["Shipping", shipping === 0 ? "FREE" : `₹${shipping}`]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: ".85rem", color: "var(--stone)", marginBottom: ".4rem" }}>
                <span>{k}</span><span>{v}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.1rem", marginTop: ".75rem" }}>
              <span>Total</span><span style={{ fontFamily: "var(--font-display)" }}>₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
