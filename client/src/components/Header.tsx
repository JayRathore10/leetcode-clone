import "../styles/Header.css";

export function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <span className="logo">CodeChamp</span>
      </div>

      <nav className="header-nav">
        <a className="nav-link">Problems</a>
        <a className="nav-link">Contests</a>
        <a className="nav-link">Discuss</a>
        <a className="nav-link">Leaderboard</a>
      </nav>

      <div className="header-right">
        <button className="header-btn">Login</button>
      </div>
    </header>
  );
}
