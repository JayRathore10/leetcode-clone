import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSun, FiMoon, FiMonitor, FiChevronDown,
  FiUser, FiLogOut
} from "react-icons/fi";
import { LoginProps } from "../../pages/Login/Login";
import logo from "../../assets/logo.png";
import "./Header.css";

type ThemeType = "light" | "dark" | "system";

function applyTheme(pref: ThemeType) {
  const active =
    pref === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      : pref;
  document.documentElement.setAttribute("data-theme", active);
}

export function Header({ isloggedIn }: LoginProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isOnProfilePage = location.pathname === "/profile";

  const [theme, setTheme] = useState<ThemeType>(
    () => (localStorage.getItem("theme") as ThemeType) ?? "system"
  );
  const [dropOpen, setDropOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  // Apply on mount + change
  useEffect(() => {
    localStorage.setItem("theme", theme);
    applyTheme(theme);
  }, [theme]);

  // Live OS theme changes
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const fn = (e: MediaQueryListEvent) =>
      document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, [theme]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMenuOpen(false), [location.pathname]);

  const themeIcon =
    theme === "light" ? <FiSun size={16} /> :
      theme === "dark" ? <FiMoon size={16} /> :
        <FiMonitor size={16} />;

  const navLinks = [
    { to: "/problems", label: "Problems" },
    { to: "/contests", label: "Contests" },
    { to: "/discuss", label: "Discuss" },
    { to: "/leaderboard", label: "Leaderboard" },
  ];

  return (
    <header className="hdr">
      <div className="hdr-inner">
        <button className="hdr-logo" onClick={() => navigate("/home")}>
          <img
            src={logo}
            alt="CodeChamp Logo"
            className="hdr-logo-image"
          />

          <span className="hdr-logo-text">
            Code<span className="hdr-logo-accent">Champ</span>
          </span>
        </button>

        <nav className="hdr-nav" aria-label="Main navigation">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `hdr-link${isActive ? " hdr-link--active" : ""}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="hdr-right">
          {/* Theme selector */}
          <div className="hdr-theme" ref={dropRef}>
            <button
              className="hdr-theme-btn"
              onClick={() => setDropOpen(v => !v)}
              aria-label="Change theme"
              aria-expanded={dropOpen}
            >
              {themeIcon}
              <span className="hdr-theme-label">
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </span>
              <FiChevronDown
                size={13}
                style={{ transition: "transform 0.2s", transform: dropOpen ? "rotate(180deg)" : "none" }}
              />
            </button>

            <AnimatePresence>
              {dropOpen && (
                <motion.div
                  className="hdr-theme-menu"
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  role="menu"
                >
                  {(["light", "dark", "system"] as ThemeType[]).map(t => (
                    <button
                      key={t}
                      className={`hdr-theme-item${theme === t ? " active" : ""}`}
                      onClick={() => { setTheme(t); setDropOpen(false); }}
                      role="menuitem"
                    >
                      {t === "light" && <FiSun size={14} />}
                      {t === "dark" && <FiMoon size={14} />}
                      {t === "system" && <FiMonitor size={14} />}
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>


          {isloggedIn ? (
            <button
              className="hdr-user-btn"
              onClick={() => navigate(isOnProfilePage ? "/logout" : "/profile")}
            >
              {isOnProfilePage ? <FiLogOut size={15} /> : <FiUser size={15} />}
              <span>{isOnProfilePage ? "Logout" : "Profile"}</span>
            </button>
          ) : (
            <button className="hdr-cta-btn" onClick={() => navigate("/")}>
              Sign In
            </button>
          )}


          <button
            className="hdr-hamburger"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={`hdr-bar${menuOpen ? " open" : ""}`} />
            <span className={`hdr-bar${menuOpen ? " open" : ""}`} />
            <span className={`hdr-bar${menuOpen ? " open" : ""}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="hdr-mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `hdr-mobile-link${isActive ? " hdr-mobile-link--active" : ""}`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="hdr-mobile-divider" />
            {isloggedIn ? (
              <button
                className="hdr-mobile-link"
                onClick={() => navigate(isOnProfilePage ? "/logout" : "/profile")}
              >
                {isOnProfilePage ? "Logout" : "Profile"}
              </button>
            ) : (
              <button className="hdr-mobile-link" onClick={() => navigate("/")}>
                Sign In
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
