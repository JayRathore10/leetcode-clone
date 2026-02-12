import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/auth.css";
import { useState } from "react";
import { env } from "../configs/env.config";
import { Header } from "./Header";

export interface LoginProps {
  setIsloggedIn ?: React.Dispatch<React.SetStateAction<boolean>>;
  isloggedIn ?: boolean
};

export function Login({setIsloggedIn , isloggedIn} : LoginProps) {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${env.backendUrl}/api/auth/login`, {
        email,
        password
      } ,   { withCredentials: true })
      if (response.data.success === true) {
        setIsloggedIn?.(true);
        navigate("/problems");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header isloggedIn={isloggedIn!} />
      <div className="login-container">
        <h1 className="login-title">Welcome Back</h1>

        <p className="login-subtitle">
          Enter your credentials to access your account
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
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
      </div>
    </>
  );
}
