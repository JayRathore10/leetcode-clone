import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/auth.css";
import { useState } from "react";
import { env } from "../../configs/env.config";
import { motion } from "framer-motion";
import { FiCode, FiAlertCircle } from "react-icons/fi";
import { Header } from "../../components/Header/Header";

export function SignUp() {
  const navigate = useNavigate();
  const [name,            setName]            = useState("");
  const [username,        setUsername]        = useState("");
  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error,           setError]           = useState("");
  const [loading,         setLoading]         = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${env.backendUrl}/api/auth/register`,
        { email, name, password, username },
        { withCredentials: true }
      );
      navigate("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message;
        setError(msg === "User Already Exists" ? "That email or username is already taken." : "Something went wrong. Please try again.");
      } else {
        setError("Unexpected error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Header/>
      <div className="auth-body">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          style={{ maxWidth: 480 }}
        >
          <div className="auth-logo">
            <div className="auth-logo-mark"><FiCode size={18} /></div>
            <span className="auth-logo-name">
              Code<span className="auth-logo-accent">Champ</span>
            </span>
          </div>

          <h1 className="auth-heading">Create your account</h1>
          <p className="auth-sub">Start solving problems and level up your skills</p>

          {error && (
            <div className="auth-error" style={{ marginBottom: 12 }}>
              <FiAlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="auth-field">
                <label className="auth-label" htmlFor="su-name">Full name</label>
                <input id="su-name" className="auth-input" type="text" placeholder="Jane Doe" required value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="auth-field">
                <label className="auth-label" htmlFor="su-username">Username</label>
                <input id="su-username" className="auth-input" type="text" placeholder="jane_dev" required value={username} onChange={e => setUsername(e.target.value)} />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="su-email">Email address</label>
              <input id="su-email" className="auth-input" type="email" placeholder="you@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="auth-field">
                <label className="auth-label" htmlFor="su-pw">Password</label>
                <input id="su-pw" className="auth-input" type="password" placeholder="Min. 6 chars" required value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <div className="auth-field">
                <label className="auth-label" htmlFor="su-confirm">Confirm</label>
                <input id="su-confirm" className="auth-input" type="password" placeholder="Repeat password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?{" "}
            <button className="auth-link" onClick={() => navigate("/")}>Sign in</button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
