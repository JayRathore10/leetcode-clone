import "../styles/auth.css";

export function NotFound() {
  return (
    <div className="login-container">
      <h1 className="login-title">404</h1>

      <p className="login-subtitle">
        Oops! The page you are looking for does not exist.
      </p>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          className="login-button"
          onClick={() => window.location.href = "/"}
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
