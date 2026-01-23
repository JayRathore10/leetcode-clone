import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Header.css";

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-left">
        <span className="logo" onClick={() => navigate("/")}>
          CodeChamp
        </span>
      </div>

      <nav className="header-nav">
        <NavLink to="/problems" className="nav-link">
          Problems
        </NavLink>

        <NavLink to="/contests" className="nav-link">
          Contests
        </NavLink>

        <NavLink to="/discuss" className="nav-link">
          Discuss
        </NavLink>

        <NavLink to="/leaderboard" className="nav-link">
          Leaderboard
        </NavLink>
      </nav>

      <div className="header-right">
        <button
          className="header-btn"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
    </header>
  );
}

