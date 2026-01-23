import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

export function SignUp() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // ❌ stop page reload

    // TODO: call signup API here

    // temporary success redirect
    navigate("/login");
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Create an Account</h1>

      <p className="login-subtitle">
        Enter your information to get started
      </p>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            required
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
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
}
