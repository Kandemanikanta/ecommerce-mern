import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFeaturedProducts, getCategories } from "../services/api";
import ProductCard from "../components/ProductCard";

const CATEGORY_ICONS = {
  Electronics: "⚡",
  Accessories: "✦",
  Footwear: "👟",
  Sports: "🏃",
  Lifestyle: "✿",
  Clothing: "👔",
  Books: "📚",
  Other: "◆",
};

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [fp, cats] = await Promise.all([getFeaturedProducts(), getCategories()]);
        setFeatured(fp.data);
        setCategories(cats.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      {/* HERO */}
      <section style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1C1917 0%, #3D3835 50%, #1C1917 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
        paddingTop: 68,
      }}>
        {/* Decorative circles */}
        {[{ top: "10%", left: "5%", size: 400, opacity: .04 }, { bottom: "5%", right: "3%", size: 600, opacity: .03 }].map((c, i) => (
          <div key={i} style={{
            position: "absolute", top: c.top, bottom: c.bottom, left: c.left, right: c.right,
            width: c.size, height: c.size,
            borderRadius: "50%",
            background: "var(--gold)",
            opacity: c.opacity,
          }} />
        ))}
        <div style={{
          position: "absolute", top: "20%", right: "8%",
          width: 1, height: 300, background: "linear-gradient(to bottom, transparent, var(--gold), transparent)",
          opacity: .25,
        }} />

        <div className="container fade-up" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: ".8rem", letterSpacing: ".25em", color: "var(--gold)", textTransform: "uppercase", marginBottom: "1.25rem" }}>
            Premium · Curated · Delivered
          </p>
          <h1 style={{ color: "var(--white)", marginBottom: "1.5rem", maxWidth: 700, margin: "0 auto 1.5rem" }}>
            Discover Things Worth <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Owning</em>
          </h1>
          <p style={{ color: "rgba(255,255,255,.6)", fontSize: "1.1rem", maxWidth: 520, margin: "0 auto 2.5rem", fontWeight: 300 }}>
            A carefully curated selection of premium products, delivered to your door with care.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/products" className="btn btn-gold" style={{ fontSize: "1rem", padding: ".9rem 2.25rem" }}>
              Shop Now →
            </Link>
            <Link to="/products?featured=true" className="btn" style={{
              border: "1px solid rgba(255,255,255,.25)", color: "var(--white)",
              padding: ".9rem 2.25rem", fontSize: "1rem",
            }}>
              New Arrivals
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: "flex", gap: "3rem", justifyContent: "center",
            marginTop: "4rem", paddingTop: "2.5rem",
            borderTop: "1px solid rgba(255,255,255,.08)",
            flexWrap: "wrap",
          }}>
            {[["10K+", "Happy Customers"], ["500+", "Premium Products"], ["Free", "Shipping above ₹999"]].map(([val, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", color: "var(--gold)", fontWeight: 700 }}>{val}</div>
                <div style={{ fontSize: ".78rem", color: "rgba(255,255,255,.45)", letterSpacing: ".06em", textTransform: "uppercase", marginTop: ".25rem" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: "5rem 0", background: "var(--cream)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontSize: ".75rem", letterSpacing: ".2em", color: "var(--gold)", textTransform: "uppercase", marginBottom: ".75rem" }}>Browse by</p>
            <h2>Shop by Category</h2>
          </div>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            {categories.map((cat) => (
              <Link to={`/products?category=${cat}`} key={cat} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: ".5rem",
                padding: "1.5rem 2rem",
                background: "var(--white)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-sm)",
                minWidth: 120, textAlign: "center",
                transition: "all var(--transition)",
                border: "1.5px solid transparent",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
              >
                <span style={{ fontSize: "1.75rem" }}>{CATEGORY_ICONS[cat] || "◆"}</span>
                <span style={{ fontSize: ".85rem", fontWeight: 500, color: "var(--charcoal-mid)" }}>{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section style={{ padding: "5rem 0", background: "var(--cream-dark)" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <p style={{ fontSize: ".75rem", letterSpacing: ".2em", color: "var(--gold)", textTransform: "uppercase", marginBottom: ".5rem" }}>Hand-picked</p>
              <h2>Featured Products</h2>
            </div>
            <Link to="/products" className="btn btn-outline" style={{ fontSize: ".85rem" }}>View All</Link>
          </div>
          {loading ? (
            <div className="loader-wrap"><div className="spinner" /></div>
          ) : (
            <div className="products-grid">
              {featured.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* VALUE PROPOSITIONS */}
      <section style={{ padding: "4rem 0", background: "var(--charcoal)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem" }}>
            {[
              ["🚚", "Free Delivery", "On orders above ₹999"],
              ["🔒", "Secure Payment", "Stripe & Razorpay encrypted"],
              ["↩️", "Easy Returns", "30-day hassle-free returns"],
              ["💬", "24/7 Support", "We're always here to help"],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ textAlign: "center", padding: "1.5rem" }}>
                <div style={{ fontSize: "2rem", marginBottom: ".75rem" }}>{icon}</div>
                <h3 style={{ color: "var(--white)", fontSize: "1rem", marginBottom: ".35rem" }}>{title}</h3>
                <p style={{ color: "rgba(255,255,255,.45)", fontSize: ".82rem" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "var(--charcoal)", borderTop: "1px solid rgba(255,255,255,.06)", padding: "3rem 0 2rem" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--white)", fontWeight: 700 }}>
            Shop<span style={{ color: "var(--gold)" }}>Nest</span>
          </span>
          <p style={{ color: "rgba(255,255,255,.3)", fontSize: ".78rem" }}>© 2025 ShopNest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
