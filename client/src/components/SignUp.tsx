import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/auth.css";
import { useState } from "react";
import { env } from "../configs/env.config";
import { LoginProps } from "./Login";
import { Header } from "./Header";

export function SignUp({ isloggedIn }: LoginProps) {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Password and confirm password do not match");
      return;
    }
    try {
      const response = await axios.post(`${env.backendUrl}/api/auth/register`, {
        email,
        name,
        password,
        username
      } ,   { withCredentials: true });
      console.log(response.data);
      navigate("/");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message === "User Already Exists") {
          alert("User Already Exist");
        } else {
          alert("Something went wrong");
        }
      }
    }
  };

  return (
    <>

      <Header 
        isloggedIn={isloggedIn!}
      />

      <div className="login-container">
        <h1 className="login-title">Create an Account</h1>

        <p className="login-subtitle">
          Enter your information to get started
        </p>

        <form className="login-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="username"
              name="name"
              placeholder="Enter your Name"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
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
              placeholder="Create a password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-button">
            Sign Up
          </button>
        </form>

        <p className="signup-text">
          Already have an account?{" "}
          <span
            className="signup-link"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </div>
    </>
  );
}
