import "../../styles/auth.css";
import "./NotFound.css";

export function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <h1 className="not-found-code">404</h1>

        <h2 className="not-found-title">Page Not Found</h2>

        <p className="not-found-text">
          Oops! The page you are looking for does not exist or has been moved.
        </p>

        <div className="not-found-actions">
          <button
            className="auth-submit"
            onClick={() => (window.location.href = "/home")}
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}