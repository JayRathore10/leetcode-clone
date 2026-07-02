import "./Footer.css";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} CodeChamp . All rights reserved.</p>
        <div className="footer-links">
          <a href="/about" className="footer-link">About</a>
          <a href="/contact" className="footer-link">Contact</a>
        </div>
      </div>
    </footer>
  );
}