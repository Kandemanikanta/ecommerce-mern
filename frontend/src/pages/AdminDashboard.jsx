import { useState, useEffect } from "react";
import { getAllOrders, getAllUsers, getProducts, updateOrderStatus, deleteProduct } from "../services/api";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState({ products: [], total: 0 });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      if (tab === "orders") {
        const r = await getAllOrders();
        setOrders(r.data);
      } else if (tab === "users") {
        const r = await getAllUsers();
        setUsers(r.data);
      } else if (tab === "products") {
        const r = await getProducts({ limit: 50 });
        setProducts(r.data);
      }
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [tab]);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success("Status updated");
      load();
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
      load();
    } catch {
      toast.error("Delete failed");
    }
  };

  const totalRevenue = orders.filter(o => o.isPaid).reduce((a, o) => a + o.totalPrice, 0);

  const TABS = ["orders", "products", "users"];
  const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

  return (
    <div style={{ paddingTop: 68, minHeight: "100vh", background: "var(--cream)" }}>
      <div style={{ background: "var(--charcoal)", padding: "2.5rem 0" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <p style={{ fontSize: ".75rem", letterSpacing: ".2em", color: "var(--gold)", textTransform: "uppercase", marginBottom: ".5rem" }}>Admin Panel</p>
              <h1 style={{ color: "var(--white)" }}>Dashboard</h1>
            </div>
            {/* Stats */}
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              {[
                ["₹" + totalRevenue.toLocaleString("en-IN"), "Revenue"],
                [orders.length, "Orders"],
                [users.length || "–", "Users"],
                [products.total || "–", "Products"],
              ].map(([val, label]) => (
                <div key={label} style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--gold)", fontWeight: 700 }}>{val}</div>
                  <div style={{ fontSize: ".72rem", color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.5rem" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: ".5rem", marginBottom: "2rem", background: "var(--white)", borderRadius: "var(--radius-full)", padding: ".3rem", boxShadow: "var(--shadow-sm)", width: "fit-content" }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: ".55rem 1.5rem", borderRadius: "var(--radius-full)",
              background: tab === t ? "var(--charcoal)" : "transparent",
              color: tab === t ? "var(--white)" : "var(--stone)",
              fontSize: ".88rem", fontWeight: 500, textTransform: "capitalize",
              transition: "all .15s",
            }}>{t}</button>
          ))}
        </div>

        {loading ? (
          <div className="loader-wrap"><div className="spinner" /></div>
        ) : (
          <>
            {/* ORDERS TABLE */}
            {tab === "orders" && (
              <div style={{ background: "var(--white)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "var(--cream)", borderBottom: "1px solid var(--cream-dark)" }}>
                      {["Order ID", "Customer", "Items", "Total", "Payment", "Status", "Action"].map(h => (
                        <th key={h} style={{ padding: ".9rem 1rem", textAlign: "left", fontSize: ".75rem", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--stone)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, i) => (
                      <tr key={order._id} style={{ borderBottom: i < orders.length - 1 ? "1px solid var(--cream)" : "none" }}>
                        <td style={{ padding: ".85rem 1rem", fontSize: ".8rem", fontFamily: "monospace", color: "var(--stone)" }}>#{order._id.slice(-8).toUpperCase()}</td>
                        <td style={{ padding: ".85rem 1rem", fontSize: ".88rem" }}>{order.user?.name || "Unknown"}</td>
                        <td style={{ padding: ".85rem 1rem", fontSize: ".85rem", color: "var(--stone)" }}>{order.orderItems.length} items</td>
                        <td style={{ padding: ".85rem 1rem", fontWeight: 600, fontSize: ".9rem" }}>₹{order.totalPrice.toLocaleString("en-IN")}</td>
                        <td style={{ padding: ".85rem 1rem" }}>
                          <span style={{ fontSize: ".75rem", color: order.isPaid ? "green" : "var(--rust)", fontWeight: 500 }}>
                            {order.isPaid ? "✓ Paid" : "Unpaid"}
                          </span>
                        </td>
                        <td style={{ padding: ".85rem 1rem" }}>
                          <span style={{
                            padding: ".25rem .7rem", borderRadius: "var(--radius-full)",
                            fontSize: ".72rem", fontWeight: 600, textTransform: "capitalize",
                            background: { pending: "#FEF3C7", processing: "#DBEAFE", shipped: "#EDE9FE", delivered: "#D1FAE5", cancelled: "#FEE2E2" }[order.status],
                            color: { pending: "#92400E", processing: "#1E40AF", shipped: "#5B21B6", delivered: "#065F46", cancelled: "#991B1B" }[order.status],
                          }}>{order.status}</span>
                        </td>
                        <td style={{ padding: ".85rem 1rem" }}>
                          <select
                            value={order.status}
                            onChange={e => handleStatusUpdate(order._id, e.target.value)}
                            style={{ fontSize: ".8rem", padding: ".3rem .6rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--cream-dark)", background: "var(--white)" }}
                          >
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* PRODUCTS TABLE */}
            {tab === "products" && (
              <div style={{ background: "var(--white)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "var(--cream)", borderBottom: "1px solid var(--cream-dark)" }}>
                      {["Product", "Category", "Price", "Stock", "Rating", "Action"].map(h => (
                        <th key={h} style={{ padding: ".9rem 1rem", textAlign: "left", fontSize: ".75rem", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--stone)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.products?.map((p, i) => (
                      <tr key={p._id} style={{ borderBottom: "1px solid var(--cream)" }}>
                        <td style={{ padding: ".85rem 1rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                            <img src={p.images?.[0]} alt={p.name} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: "var(--radius-sm)" }} />
                            <span style={{ fontSize: ".88rem", fontWeight: 500, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: ".85rem 1rem" }}><span className="badge badge-stone">{p.category}</span></td>
                        <td style={{ padding: ".85rem 1rem", fontWeight: 600 }}>₹{p.price.toLocaleString("en-IN")}</td>
                        <td style={{ padding: ".85rem 1rem", color: p.stock === 0 ? "var(--rust)" : p.stock < 10 ? "orange" : "green", fontWeight: 500 }}>{p.stock}</td>
                        <td style={{ padding: ".85rem 1rem", color: "var(--gold)" }}>★ {p.rating.toFixed(1)}</td>
                        <td style={{ padding: ".85rem 1rem" }}>
                          <button onClick={() => handleDeleteProduct(p._id, p.name)} style={{ color: "var(--rust)", fontSize: ".82rem", fontWeight: 500 }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* USERS TABLE */}
            {tab === "users" && (
              <div style={{ background: "var(--white)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "var(--cream)", borderBottom: "1px solid var(--cream-dark)" }}>
                      {["User", "Email", "Role", "Joined"].map(h => (
                        <th key={h} style={{ padding: ".9rem 1rem", textAlign: "left", fontSize: ".75rem", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--stone)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u._id} style={{ borderBottom: "1px solid var(--cream)" }}>
                        <td style={{ padding: ".85rem 1rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: "50%",
                              background: "var(--charcoal)", color: "var(--white)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: ".85rem", fontWeight: 600,
                            }}>{u.name[0].toUpperCase()}</div>
                            <span style={{ fontWeight: 500 }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: ".85rem 1rem", fontSize: ".88rem", color: "var(--stone)" }}>{u.email}</td>
                        <td style={{ padding: ".85rem 1rem" }}>
                          <span className={`badge ${u.role === "admin" ? "badge-rust" : "badge-stone"}`}>{u.role}</span>
                        </td>
                        <td style={{ padding: ".85rem 1rem", fontSize: ".82rem", color: "var(--stone)" }}>
                          {new Date(u.createdAt).toLocaleDateString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
