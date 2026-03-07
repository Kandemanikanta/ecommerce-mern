import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts, getCategories } from "../services/api";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = Number(searchParams.get("page") || 1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (keyword) params.keyword = keyword;
      if (category) params.category = category;
      if (sort) params.sort = sort;

      const { data } = await getProducts(params);
      setProducts(data.products);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [keyword, category, sort, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { getCategories().then(r => setCategories(r.data)); }, []);

  const update = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    if (key !== "page") p.delete("page");
    setSearchParams(p);
  };

  return (
    <div style={{ paddingTop: 68, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "var(--charcoal)", padding: "3rem 0 2.5rem" }}>
        <div className="container">
          <h1 style={{ color: "var(--white)" }}>
            {category ? category : keyword ? `"${keyword}"` : "All Products"}
          </h1>
          <p style={{ color: "rgba(255,255,255,.45)", marginTop: ".5rem", fontSize: ".9rem" }}>
            {total} items found
          </p>
          {/* Search bar */}
          <form onSubmit={e => { e.preventDefault(); update("keyword", e.target.search.value); }} style={{ display: "flex", gap: ".75rem", marginTop: "1.5rem", maxWidth: 480 }}>
            <input name="search" defaultValue={keyword} placeholder="Search products…" className="form-input" style={{ flex: 1 }} />
            <button type="submit" className="btn btn-gold">Search</button>
          </form>
        </div>
      </div>

      <div className="container" style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "2rem", padding: "2.5rem 1.5rem", alignItems: "start" }}>
        {/* Sidebar */}
        <aside style={{ background: "var(--white)", borderRadius: "var(--radius-lg)", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }} className="hide-mobile">
          <h3 style={{ fontSize: "1rem", marginBottom: "1.25rem", paddingBottom: ".75rem", borderBottom: "1px solid var(--cream-dark)" }}>Filters</h3>

          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontSize: ".75rem", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--stone)", marginBottom: ".75rem", fontWeight: 600 }}>Category</p>
            <div style={{ display: "flex", flexDirection: "column", gap: ".4rem" }}>
              <button onClick={() => update("category", "")} style={{
                textAlign: "left", padding: ".45rem .75rem",
                borderRadius: "var(--radius-sm)", fontSize: ".87rem",
                background: !category ? "var(--charcoal)" : "transparent",
                color: !category ? "var(--white)" : "var(--charcoal-mid)",
                transition: "all .15s",
              }}>All Categories</button>
              {categories.map(cat => (
                <button key={cat} onClick={() => update("category", cat)} style={{
                  textAlign: "left", padding: ".45rem .75rem",
                  borderRadius: "var(--radius-sm)", fontSize: ".87rem",
                  background: category === cat ? "var(--charcoal)" : "transparent",
                  color: category === cat ? "var(--white)" : "var(--charcoal-mid)",
                  transition: "all .15s",
                }}>{cat}</button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products */}
        <div>
          {/* Sort bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: ".75rem" }}>
            <p style={{ fontSize: ".85rem", color: "var(--stone)" }}>Showing {products.length} of {total}</p>
            <select value={sort} onChange={e => update("sort", e.target.value)} className="form-input" style={{ width: "auto", padding: ".5rem 1rem" }}>
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {loading ? (
            <div className="loader-wrap"><div className="spinner" /></div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
              </svg>
              <h3>No products found</h3>
              <p style={{ marginTop: ".5rem" }}>Try a different search or category</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", gap: ".5rem", justifyContent: "center", marginTop: "3rem" }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => update("page", p)} style={{
                  width: 38, height: 38,
                  borderRadius: "50%",
                  background: p === page ? "var(--charcoal)" : "var(--white)",
                  color: p === page ? "var(--white)" : "var(--charcoal)",
                  boxShadow: "var(--shadow-sm)",
                  fontWeight: 500, fontSize: ".88rem",
                  transition: "all .15s",
                }}>{p}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
