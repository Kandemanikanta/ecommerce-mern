import { createContext, useContext, useState, useEffect } from "react";
import { login as loginAPI, register as registerAPI } from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await loginAPI({ email, password });
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      toast.success(`Welcome back, ${data.name.split(" ")[0]}!`);
      return { success: true, role: data.role };
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await registerAPI({ name, email, password });
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      toast.success("Account created!");
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast("Logged out", { icon: "👋" });
  };

  const updateUser = (data) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
