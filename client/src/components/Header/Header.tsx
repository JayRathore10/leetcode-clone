import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSun, FiMoon, FiMonitor, FiChevronDown, FiUser, FiLogOut } from "react-icons/fi";
import { LoginProps } from "../../pages/Login/Login";
import "./Header.css";

const fadeup = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 }
};

export function Header({ isloggedIn }: LoginProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isOnProfilePage = location.pathname === "/profile";

  const [theme, setTheme] = useState<"light" | "dark" | "system">(() => {
    return (localStorage.getItem("theme") as "light" | "dark" | "system") || "system";
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync theme
  useEffect(() => {
    localStorage.setItem("theme", theme);
    let activeTheme = theme;
    if (theme === "system") {
      activeTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.setAttribute("data-theme", activeTheme);
  }, [theme]);

  // Sync theme on system setting changes
  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => {
      document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
    };
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [theme]);

  // Handle outside clicks for dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const getThemeIcon = () => {
    if (theme === "light") return <FiSun className="theme-btn-icon" />;
    if (theme === "dark") return <FiMoon className="theme-btn-icon" />;
    return <FiMonitor className="theme-btn-icon" />;
  };

  return (
    <motion.header 
      className="header"
      initial="hidden"
      animate="visible"
      variants={fadeup} 
      transition={{ duration: 0.4 }}
    >
      <div className="header-container">
        <div className="header-left">
          <span className="logo" onClick={() => navigate("/home")}>
            <span className="logo-accent">Code</span>Champ
          </span>
        </div>

        <nav className="header-nav">
          <NavLink to="/problems" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Problems
          </NavLink>
          <NavLink to="/contests" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Contests
          </NavLink>
          <NavLink to="/discuss" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Discuss
          </NavLink>
          <NavLink to="/leaderboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Leaderboard
          </NavLink>
        </nav>

        <div className="header-right">
          {/* Custom Theme Selector Dropdown */}
          <div className="theme-selector-container" ref={dropdownRef}>
            <button 
              className="theme-dropdown-trigger" 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              title="Change theme"
            >
              {getThemeIcon()}
              <span className="theme-trigger-text">{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
              <FiChevronDown className={`chevron-icon ${dropdownOpen ? "open" : ""}`} />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div 
                  className="theme-dropdown-menu"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  <button 
                    className={`theme-menu-item ${theme === "light" ? "active" : ""}`}
                    onClick={() => { setTheme("light"); setDropdownOpen(false); }}
                  >
                    <FiSun className="menu-item-icon" />
                    Light
                  </button>
                  <button 
                    className={`theme-menu-item ${theme === "dark" ? "active" : ""}`}
                    onClick={() => { setTheme("dark"); setDropdownOpen(false); }}
                  >
                    <FiMoon className="menu-item-icon" />
                    Dark
                  </button>
                  <button 
                    className={`theme-menu-item ${theme === "system" ? "active" : ""}`}
                    onClick={() => { setTheme("system"); setDropdownOpen(false); }}
                  >
                    <FiMonitor className="menu-item-icon" />
                    System
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            className={`header-btn ${isloggedIn ? "logged-in" : "logged-out"}`}
            onClick={() => {
              if (isloggedIn === false) {
                navigate("/");
              } else if (isOnProfilePage) {
                navigate("/logout");
              } else {
                navigate("/profile");
              }
            }}
          >
            {isloggedIn ? (
              isOnProfilePage ? (
                <>
                  <FiLogOut className="btn-icon" />
                  <span>Logout</span>
                </>
              ) : (
                <>
                  <FiUser className="btn-icon" />
                  <span>Profile</span>
                </>
              )
            ) : (
              "Login"
            )}
          </button>
        </div>
      </div>
    </motion.header>
  );
}
