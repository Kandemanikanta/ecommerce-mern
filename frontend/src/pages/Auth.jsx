import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) navigate(result.role === "admin" ? "/admin" : from, { replace: true });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cream)", padding: "5rem 1rem 2rem" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link to="/" style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 700, color: "var(--charcoal)" }}>
            Shop<span style={{ color: "var(--gold)" }}>Nest</span>
          </Link>
          <h2 style={{ marginTop: "1.5rem", marginBottom: ".5rem" }}>Welcome back</h2>
          <p style={{ color: "var(--stone)", fontSize: ".9rem" }}>Sign in to your account</p>
        </div>

        <div style={{ background: "var(--white)", borderRadius: "var(--radius-xl)", padding: "2.5rem", boxShadow: "var(--shadow-lg)" }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className="form-input" placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} className="form-input" placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: ".9rem", marginTop: ".5rem" }} disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div style={{ marginTop: "1.5rem", padding: "1rem", background: "var(--cream)", borderRadius: "var(--radius-md)", fontSize: ".8rem", color: "var(--stone)" }}>
            <strong>Demo accounts:</strong><br />
            Admin: admin@shop.com / admin123<br />
            User: user@shop.com / user123
          </div>

          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: ".88rem", color: "var(--stone)" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--charcoal)", fontWeight: 600 }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert("Passwords don't match");
      return;
    }
    const result = await register(form.name, form.email, form.password);
    if (result.success) navigate("/");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cream)", padding: "5rem 1rem 2rem" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link to="/" style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 700, color: "var(--charcoal)" }}>
            Shop<span style={{ color: "var(--gold)" }}>Nest</span>
          </Link>
          <h2 style={{ marginTop: "1.5rem", marginBottom: ".5rem" }}>Create Account</h2>
          <p style={{ color: "var(--stone)", fontSize: ".9rem" }}>Start shopping in seconds</p>
        </div>

        <div style={{ background: "var(--white)", borderRadius: "var(--radius-xl)", padding: "2.5rem", boxShadow: "var(--shadow-lg)" }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="form-input" placeholder="Priya Sharma" required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className="form-input" placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} className="form-input" placeholder="Min. 6 characters" required minLength={6} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input name="confirm" type="password" value={form.confirm} onChange={handleChange} className="form-input" placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: ".9rem", marginTop: ".5rem" }} disabled={loading}>
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: ".88rem", color: "var(--stone)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--charcoal)", fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
