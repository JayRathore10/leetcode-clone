import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/auth.css";
import { useState } from "react";
import { env } from "../../configs/env.config";
import { Header } from "../../components/Header/Header";
import { motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import logo from "../../assets/logo.png";

export interface LoginProps {
  setIsloggedIn?: React.Dispatch<React.SetStateAction<boolean>>;
  isloggedIn?: boolean;
}

export function Login({ setIsloggedIn }: LoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        `${env.backendUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        setIsloggedIn?.(true);
        if (res.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/problems");
        }
      }
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Header />
      <div className="auth-body">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <div className="auth-logo">
            <div className="auth-logo-mark">
              <img src={logo} alt="CodeChamp Logo" className="auth-logo-img" />
            </div>
            <span className="auth-logo-name">
              Code<span className="auth-logo-accent">Champ</span>
            </span>
          </div>

          <h1 className="auth-heading">Welcome back</h1>
          <p className="auth-sub">Enter your credentials to access your account</p>

          {error && (
            <div className="auth-error">
              <FiAlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                className="auth-input"
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div className="auth-options">
              <input id="remember" type="checkbox" />
              <label htmlFor="remember">Remember me</label>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account?{" "}
            <button className="auth-link" onClick={() => navigate("/signup")}>
              Create account
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
