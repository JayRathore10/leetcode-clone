import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

export function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // stop page reload

    // TODO: call login API here

    // temporary success redirect
    navigate("/problemset");
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Welcome Back</h1>

      <p className="login-subtitle">
        Enter your credentials to access your account
      </p>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email or Username</label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Enter your email or username"
            required
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
  );
}
