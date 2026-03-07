import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById, createReview } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Stars } from "../components/ProductCard";
import toast from "react-hot-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then(r => { setProduct(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    try {
      await createReview(id, { rating: reviewRating, comment: reviewText });
      toast.success("Review submitted!");
      const r = await getProductById(id);
      setProduct(r.data);
      setReviewText(""); setReviewRating(5);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit review");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <div className="loader-wrap" style={{ paddingTop: 68 }}><div className="spinner" /></div>;
  if (!product) return <div className="empty-state" style={{ paddingTop: 100 }}><h3>Product not found</h3></div>;

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div style={{ paddingTop: 90, minHeight: "100vh" }}>
      <div className="container" style={{ padding: "2rem 1.5rem" }}>
        {/* Breadcrumb */}
        <p style={{ fontSize: ".82rem", color: "var(--stone)", marginBottom: "2rem" }}>
          <Link to="/">Home</Link> / <Link to="/products">Products</Link> / {product.name}
        </p>

        {/* Main Product */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start", marginBottom: "4rem" }}>
          {/* Images */}
          <div>
            <div style={{ borderRadius: "var(--radius-xl)", overflow: "hidden", aspectRatio: "1/1", background: "var(--cream)", marginBottom: ".75rem" }}>
              <img src={product.images?.[activeImg] || ""} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            {product.images?.length > 1 && (
              <div style={{ display: "flex", gap: ".5rem" }}>
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} style={{
                    width: 70, height: 70, borderRadius: "var(--radius-md)", overflow: "hidden",
                    border: activeImg === i ? "2px solid var(--charcoal)" : "2px solid transparent",
                    transition: "border-color .15s",
                  }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div style={{ display: "flex", gap: ".5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
              <span className="badge badge-stone">{product.category}</span>
              {product.featured && <span className="badge badge-gold">Featured</span>}
              {product.stock === 0 && <span className="badge badge-rust">Out of Stock</span>}
            </div>

            <h1 style={{ fontFamily: "var(--font-display)", marginBottom: ".5rem" }}>{product.name}</h1>
            <p style={{ fontSize: ".9rem", color: "var(--stone)", marginBottom: "1rem" }}>by <strong>{product.brand}</strong></p>

            <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1.5rem" }}>
              <Stars rating={product.rating} />
              <span style={{ fontSize: ".85rem", color: "var(--stone)" }}>{product.rating.toFixed(1)} ({product.numReviews} reviews)</span>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <span style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {discount > 0 && (
                <>
                  <span style={{ fontSize: "1.1rem", textDecoration: "line-through", color: "var(--stone)", marginLeft: ".75rem" }}>
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="badge badge-rust" style={{ marginLeft: ".75rem" }}>{discount}% off</span>
                </>
              )}
            </div>

            <p style={{ color: "var(--stone)", lineHeight: 1.7, marginBottom: "2rem" }}>{product.description}</p>

            {/* Stock info */}
            <p style={{ fontSize: ".82rem", color: product.stock > 10 ? "green" : product.stock > 0 ? "orange" : "var(--rust)", marginBottom: "1.25rem" }}>
              {product.stock > 10 ? "✓ In Stock" : product.stock > 0 ? `Only ${product.stock} left` : "✗ Out of Stock"}
            </p>

            {/* Qty + Add */}
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", border: "1.5px solid var(--cream-dark)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ padding: ".5rem .9rem", fontSize: "1.1rem", color: "var(--stone)" }}>−</button>
                <span style={{ padding: ".5rem .75rem", fontWeight: 600, minWidth: 36, textAlign: "center" }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{ padding: ".5rem .9rem", fontSize: "1.1rem", color: "var(--stone)" }}>+</button>
              </div>
              <button
                className="btn btn-primary"
                style={{ flex: 1, padding: ".85rem 2rem", fontSize: ".95rem" }}
                onClick={() => addToCart(product._id, qty)}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? "Sold Out" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div style={{ borderTop: "1px solid var(--cream-dark)", paddingTop: "3rem" }}>
          <h2 style={{ marginBottom: "2rem" }}>Customer Reviews</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>
            {/* Review list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {product.reviews.length === 0 ? (
                <p style={{ color: "var(--stone)" }}>No reviews yet. Be the first!</p>
              ) : product.reviews.map(r => (
                <div key={r._id} style={{ background: "var(--white)", borderRadius: "var(--radius-md)", padding: "1.25rem", boxShadow: "var(--shadow-sm)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".5rem" }}>
                    <strong>{r.name}</strong>
                    <Stars rating={r.rating} />
                  </div>
                  <p style={{ fontSize: ".9rem", color: "var(--stone)" }}>{r.comment}</p>
                  <p style={{ fontSize: ".75rem", color: "var(--stone-light)", marginTop: ".5rem" }}>
                    {new Date(r.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
              ))}
            </div>

            {/* Write review */}
            {user ? (
              <div style={{ background: "var(--white)", borderRadius: "var(--radius-lg)", padding: "2rem", boxShadow: "var(--shadow-sm)" }}>
                <h3 style={{ marginBottom: "1.5rem" }}>Write a Review</h3>
                <form onSubmit={submitReview}>
                  <div className="form-group">
                    <label className="form-label">Rating</label>
                    <select value={reviewRating} onChange={e => setReviewRating(Number(e.target.value))} className="form-input">
                      {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} ★</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Comment</label>
                    <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} className="form-input" rows={4} required placeholder="Share your experience..." />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={reviewLoading}>
                    {reviewLoading ? "Submitting…" : "Submit Review"}
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "2rem", background: "var(--white)", borderRadius: "var(--radius-lg)" }}>
                <p style={{ color: "var(--stone)", marginBottom: "1rem" }}>Login to leave a review</p>
                <Link to="/login" className="btn btn-primary">Login</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
