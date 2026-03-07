import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(249,245,240,.96)" : "transparent",
      backdropFilter: scrolled ? "blur(14px)" : "none",
      borderBottom: scrolled ? "1px solid var(--cream-dark)" : "1px solid transparent",
      transition: "all .3s ease",
    }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem", color: "var(--charcoal)" }}>
            Shop<span style={{ color: "var(--gold)" }}>Nest</span>
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hide-mobile" style={{ display: "flex", gap: "2rem" }}>
          {[["Products", "/products"], ["Categories", "/products?view=categories"]].map(([label, path]) => (
            <Link key={label} to={path} style={{
              fontSize: ".88rem", fontWeight: 500, letterSpacing: ".03em",
              color: "var(--charcoal-mid)", transition: "color .2s",
            }}
            onMouseEnter={e => e.target.style.color = "var(--gold)"}
            onMouseLeave={e => e.target.style.color = "var(--charcoal-mid)"}
            >{label}</Link>
          ))}
          {isAdmin && (
            <Link to="/admin" style={{ fontSize: ".88rem", fontWeight: 600, color: "var(--rust)", letterSpacing: ".03em" }}>
              Admin
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
          {/* Search */}
          <Link to="/products" className="btn btn-ghost" style={{ padding: ".5rem" }} title="Search">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </Link>

          {/* Cart */}
          <Link to="/cart" style={{ position: "relative", padding: ".5rem" }} className="btn btn-ghost" title="Cart">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span style={{
                position: "absolute", top: 4, right: 4,
                background: "var(--gold)", color: "var(--charcoal)",
                borderRadius: "50%", width: 16, height: 16,
                fontSize: ".65rem", fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{cartCount > 9 ? "9+" : cartCount}</span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <div style={{ position: "relative" }} className="dropdown-wrap">
              <button className="btn btn-ghost" style={{ display: "flex", alignItems: "center", gap: ".4rem", padding: ".5rem .75rem" }}>
                <span style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "var(--charcoal)", color: "var(--white)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: ".8rem", fontWeight: 600,
                }}>{user.name[0].toUpperCase()}</span>
                <span className="hide-mobile" style={{ fontSize: ".85rem", fontWeight: 500 }}>{user.name.split(" ")[0]}</span>
              </button>
              <div style={{
                position: "absolute", right: 0, top: "calc(100% + 8px)",
                background: "var(--white)", borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-lg)", minWidth: 180, overflow: "hidden",
                border: "1px solid var(--cream-dark)",
              }} className="dropdown">
                <Link to="/orders" style={{ display: "block", padding: ".75rem 1rem", fontSize: ".88rem", color: "var(--charcoal-mid)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--cream)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >My Orders</Link>
                <Link to="/profile" style={{ display: "block", padding: ".75rem 1rem", fontSize: ".88rem", color: "var(--charcoal-mid)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--cream)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >Profile</Link>
                <button onClick={handleLogout} style={{
                  display: "block", width: "100%", textAlign: "left",
                  padding: ".75rem 1rem", fontSize: ".88rem", color: "var(--rust)",
                  borderTop: "1px solid var(--cream-dark)",
                }}>Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: ".55rem 1.25rem", fontSize: ".85rem" }}>
              Sign In
            </Link>
          )}
        </div>
      </div>

      <style>{`
        .dropdown { opacity: 0; pointer-events: none; transform: translateY(-6px); transition: all .18s ease; }
        .dropdown-wrap:hover .dropdown { opacity: 1; pointer-events: all; transform: translateY(0); }
      `}</style>
    </header>
  );
};

export default Navbar;
