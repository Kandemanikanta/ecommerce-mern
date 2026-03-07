import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toggleWishlist } from "../services/api";
import toast from "react-hot-toast";

const Stars = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="stars" aria-label={`${rating} stars`}>
      {"★".repeat(full)}{half ? "½" : ""}{"☆".repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
};

const ProductCard = ({ product }) => {
  const { addToCart, cartLoading } = useCart();
  const { user } = useAuth();
  const [wished, setWished] = useState(user?.wishlist?.includes(product._id));
  const [imgError, setImgError] = useState(false);

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Login to save items"); return; }
    try {
      await toggleWishlist(product._id);
      setWished(!wished);
    } catch {
      toast.error("Could not update wishlist");
    }
  };

  return (
    <div className="card fade-up" style={{ position: "relative" }}>
      {/* Image */}
      <Link to={`/products/${product._id}`}>
        <div style={{ position: "relative", overflow: "hidden", aspectRatio: "1/1", background: "var(--cream)" }}>
          <img
            src={imgError ? "/placeholder.jpg" : product.images?.[0] || "/placeholder.jpg"}
            alt={product.name}
            onError={() => setImgError(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s ease" }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          />
          {discount > 0 && (
            <span className="badge badge-rust" style={{ position: "absolute", top: 10, left: 10 }}>
              -{discount}%
            </span>
          )}
          {product.stock === 0 && (
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(249,245,240,.8)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span className="badge badge-stone" style={{ fontSize: ".8rem" }}>Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      {/* Wishlist */}
      <button onClick={handleWishlist} style={{
        position: "absolute", top: 10, right: 10,
        background: "var(--white)", borderRadius: "50%",
        width: 34, height: 34,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "var(--shadow-sm)", transition: "transform .2s",
        fontSize: "1rem",
      }}
        title={wished ? "Remove from wishlist" : "Add to wishlist"}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        {wished ? "♥" : "♡"}
      </button>

      {/* Details */}
      <div style={{ padding: "1rem" }}>
        <p style={{ fontSize: ".72rem", color: "var(--stone)", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: ".3rem" }}>
          {product.brand}
        </p>
        <Link to={`/products/${product._id}`}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: ".5rem", fontFamily: "var(--font-display)", lineHeight: 1.3 }}>
            {product.name}
          </h3>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".75rem" }}>
          <Stars rating={product.rating} />
          <span style={{ fontSize: ".75rem", color: "var(--stone)" }}>({product.numReviews})</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "1.15rem", fontWeight: 600, color: "var(--charcoal)" }}>
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {discount > 0 && (
              <span style={{ fontSize: ".8rem", color: "var(--stone)", textDecoration: "line-through", marginLeft: ".4rem" }}>
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <button
            className="btn btn-primary"
            style={{ padding: ".45rem .9rem", fontSize: ".78rem" }}
            onClick={() => addToCart(product._id)}
            disabled={cartLoading || product.stock === 0}
          >
            {product.stock === 0 ? "Sold Out" : "+ Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
export { Stars };
