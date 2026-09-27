import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/auth.css";
import { useState } from "react";
import { env } from "../../configs/env.config";
import { Header } from "../../components/Header/Header";
import { motion } from "framer-motion";
import logo from "../../assets/logo.png";

export interface LoginProps {
  setIsloggedIn?: React.Dispatch<React.SetStateAction<boolean>>; 
  isloggedIn?: boolean;
}

interface loginPropsInternal{
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   setUser: React.Dispatch<React.SetStateAction<any>>;
    setIsloggedIn?: React.Dispatch<React.SetStateAction<boolean>>; 
  isloggedIn?: boolean;
}

export function Login({ setIsloggedIn ,setUser }: loginPropsInternal) {
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
        setUser(res.data.user);
        console.log(res.data.user.role);
        if (res.data.user.role === "admin") {
          console.log("navigate to Admin");
          navigate("/admin");
        } else {
          console.log("Navigate to problems");
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
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
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
          <p className="auth-sub">Sign in to continue solving problems on CodeChamp</p>

          {error && (
            <div className="auth-error" role="alert" aria-live="polite">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="13" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
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
                autoComplete="email"
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
                autoComplete="current-password"
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