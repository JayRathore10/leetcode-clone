import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/auth.css";
import { useState } from "react";
import { env } from "../../configs/env.config";
import { Header } from "../../components/Header/Header";
import { motion } from "framer-motion";

export interface LoginProps {
  setIsloggedIn?: React.Dispatch<React.SetStateAction<boolean>>;
  isloggedIn?: boolean;
}

export function Login({ setIsloggedIn, isloggedIn }: LoginProps) {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const response = await axios.post(
        `${env.backendUrl}/api/auth/login`,
        {
          email,
          password
        },
        { withCredentials: true }
      );
      if (response.data.success === true) {
        localStorage.setItem("token", response.data.token);
        setIsloggedIn?.(true);
        navigate("/problems");
      }
    } catch (error) {
      console.log(error);
      setErrorMsg("Invalid email or password");
    }
  };

  return (
    <>
      <Header isloggedIn={isloggedIn!} />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 100px)", padding: "20px" }}>
        <motion.div 
          className="login-container"
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ margin: 0 }}
        >
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">
            Enter your credentials to access your account
          </p>

          {errorMsg && (
            <div style={{ color: "var(--hard-color)", fontSize: "13px", fontWeight: "600", marginBottom: "16px", textAlign: "center", padding: "8px", borderRadius: "6px", backgroundColor: "rgba(239, 68, 68, 0.1)" }}>
              {errorMsg}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                Remember me
              </label>
            </div>

            <button type="submit" className="login-button">
              Login
            </button>
          </form>

          <p className="signup-text">
            Don&apos;t have an account?{" "}
            <span
              className="signup-link"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </p>
        </motion.div>
      </div>
    </>
  );
}
