import { useState, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getMyOrders, getOrderById } from "../services/api";

const STATUS_COLORS = {
  pending: "#C9A84C",
  processing: "#3B82F6",
  shipped: "#8B5CF6",
  delivered: "#10B981",
  cancelled: "#EF4444",
};

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders().then(r => { setOrders(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loader-wrap" style={{ paddingTop: 100 }}><div className="spinner" /></div>;

  return (
    <div style={{ paddingTop: 90, minHeight: "100vh" }}>
      <div style={{ background: "var(--charcoal)", padding: "2.5rem 0" }}>
        <div className="container"><h1 style={{ color: "var(--white)" }}>My Orders</h1></div>
      </div>
      <div className="container" style={{ padding: "2.5rem 1.5rem" }}>
        {orders.length === 0 ? (
          <div className="empty-state">
            <h3>No orders yet</h3>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: "1.5rem" }}>Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {orders.map(order => (
              <Link to={`/orders/${order._id}`} key={order._id} style={{
                background: "var(--white)", borderRadius: "var(--radius-lg)",
                padding: "1.5rem", boxShadow: "var(--shadow-sm)",
                display: "grid", gridTemplateColumns: "auto 1fr auto auto",
                gap: "1.5rem", alignItems: "center",
                transition: "box-shadow .2s",
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "var(--shadow-sm)"}
              >
                <div>
                  <img src={order.orderItems[0]?.image} alt="" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: "var(--radius-md)" }} />
                </div>
                <div>
                  <p style={{ fontSize: ".78rem", color: "var(--stone)", marginBottom: ".25rem" }}>
                    Order #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p style={{ fontWeight: 500 }}>{order.orderItems.length} item{order.orderItems.length > 1 ? "s" : ""}</p>
                  <p style={{ fontSize: ".82rem", color: "var(--stone)", marginTop: ".2rem" }}>
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontWeight: 700, fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>
                    ₹{order.totalPrice.toLocaleString("en-IN")}
                  </p>
                  <p style={{ fontSize: ".78rem", color: "var(--stone)" }}>{order.paymentMethod}</p>
                </div>
                <div>
                  <span style={{
                    padding: ".3rem .9rem", borderRadius: "var(--radius-full)",
                    fontSize: ".75rem", fontWeight: 600,
                    background: STATUS_COLORS[order.status] + "20",
                    color: STATUS_COLORS[order.status],
                    textTransform: "capitalize",
                  }}>{order.status}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const OrderDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const justPaid = searchParams.get("success") === "1";

  useEffect(() => {
    getOrderById(id).then(r => { setOrder(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loader-wrap" style={{ paddingTop: 100 }}><div className="spinner" /></div>;
  if (!order) return <div className="empty-state" style={{ paddingTop: 100 }}><h3>Order not found</h3></div>;

  return (
    <div style={{ paddingTop: 90, minHeight: "100vh" }}>
      <div style={{ background: "var(--charcoal)", padding: "2.5rem 0" }}>
        <div className="container">
          {justPaid && (
            <div style={{ background: "var(--gold)", borderRadius: "var(--radius-md)", padding: ".75rem 1.25rem", marginBottom: "1rem", display: "inline-flex", alignItems: "center", gap: ".5rem" }}>
              <span style={{ fontWeight: 600 }}>🎉 Payment successful! Your order is confirmed.</span>
            </div>
          )}
          <h1 style={{ color: "var(--white)" }}>Order #{id.slice(-8).toUpperCase()}</h1>
          <p style={{ color: "rgba(255,255,255,.45)", marginTop: ".25rem", fontSize: ".88rem" }}>
            Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: "2.5rem 1.5rem", display: "grid", gridTemplateColumns: "1fr 340px", gap: "2.5rem", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Items */}
          <div style={{ background: "var(--white)", borderRadius: "var(--radius-lg)", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
            <h3 style={{ marginBottom: "1.25rem" }}>Order Items</h3>
            {order.orderItems.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "center", padding: ".75rem 0", borderBottom: i < order.orderItems.length - 1 ? "1px solid var(--cream)" : "none" }}>
                <img src={item.image} alt={item.name} style={{ width: 56, height: 56, objectFit: "cover", borderRadius: "var(--radius-sm)" }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 500 }}>{item.name}</p>
                  <p style={{ fontSize: ".82rem", color: "var(--stone)" }}>×{item.quantity} · ₹{item.price.toLocaleString("en-IN")} each</p>
                </div>
                <p style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>

          {/* Shipping */}
          <div style={{ background: "var(--white)", borderRadius: "var(--radius-lg)", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
            <h3 style={{ marginBottom: "1rem" }}>Shipping Address</h3>
            <p style={{ color: "var(--charcoal-mid)", lineHeight: 1.8 }}>
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
              {order.shippingAddress.country}
            </p>
          </div>
        </div>

        {/* Summary */}
        <div style={{ background: "var(--white)", borderRadius: "var(--radius-xl)", padding: "1.75rem", boxShadow: "var(--shadow-md)", position: "sticky", top: 90 }}>
          <h3 style={{ marginBottom: "1.25rem" }}>Payment Summary</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
            {[["Items", `₹${order.itemsPrice.toLocaleString()}`], ["Tax", `₹${order.taxPrice}`], ["Shipping", order.shippingPrice === 0 ? "FREE" : `₹${order.shippingPrice}`]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: ".88rem", color: "var(--stone)" }}>
                <span>{k}</span><span>{v}</span>
              </div>
            ))}
            <div style={{ borderTop: "2px solid var(--cream-dark)", paddingTop: ".75rem", display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.1rem" }}>
              <span>Total</span><span style={{ fontFamily: "var(--font-display)" }}>₹{order.totalPrice.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: ".6rem" }}>
            {[["Payment Method", order.paymentMethod], ["Payment Status", order.isPaid ? "✓ Paid" : "Pending"], ["Order Status", order.status]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: ".85rem" }}>
                <span style={{ color: "var(--stone)" }}>{k}</span>
                <span style={{
                  fontWeight: 500,
                  color: v === "✓ Paid" ? "green" : STATUS_COLORS[v] || "var(--charcoal)",
                  textTransform: "capitalize",
                }}>{v}</span>
              </div>
            ))}
          </div>

          <Link to="/orders" className="btn btn-outline" style={{ width: "100%", justifyContent: "center", marginTop: "1.5rem" }}>
            ← All Orders
          </Link>
        </div>
      </div>
    </div>
  );
};
