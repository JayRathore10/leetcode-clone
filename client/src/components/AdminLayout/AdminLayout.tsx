import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FiPieChart,
  FiCode,
  FiAward,
  FiUsers,
  FiActivity,
  FiMessageSquare,
  FiFlag,
  FiSettings,
  FiMenu,
  FiMoon,
  FiSun,
  FiLogOut,
  FiHome
} from "react-icons/fi";
import logo from "../../assets/logo.png";
import "./AdminLayout.css";

type ThemeType = "light" | "dark" | "system";

function applyTheme(pref: ThemeType) {
  const active =
    pref === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : pref;
  document.documentElement.setAttribute("data-theme", active);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AdminLayout({ user }: { user: any, setIsloggedIn: any }) {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<ThemeType>(
    () => (localStorage.getItem("theme") as ThemeType) ?? "system"
  );
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("theme", theme);
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  };

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: <FiPieChart /> },
    { path: "/admin/problems", label: "Problems", icon: <FiCode /> },
    { path: "/admin/contests", label: "Contests", icon: <FiAward /> },
    { path: "/admin/users", label: "Users", icon: <FiUsers /> },
    { path: "/admin/submissions", label: "Submissions", icon: <FiActivity /> },
    { path: "/admin/discussions", label: "Discussions", icon: <FiMessageSquare /> },
    { path: "/admin/reports", label: "Reports", icon: <FiFlag /> },
    { path: "/admin/settings", label: "Settings", icon: <FiSettings /> },
  ];

  const currentRouteName =
    navItems.find((item) =>
      item.path === "/admin"
        ? location.pathname === "/admin"
        : location.pathname.startsWith(item.path)
    )?.label || "Admin";

  const handleLogout = () => {
    navigate("/logout");
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="admin-sidebar-header">
          {!collapsed && (
            <div className="admin-logo" onClick={() => navigate("/admin")} style={{ cursor: "pointer" }}>
              <img src={logo} alt="Logo" className="admin-logo-img" />
              <span>Admin</span>
            </div>
          )}
          <button
            className="admin-sidebar-toggle"
            onClick={() => setCollapsed(!collapsed)}
          >
            <FiMenu size={20} />
          </button>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? "active" : ""}`
              }
              title={collapsed ? item.label : undefined}
            >
              <div className="admin-nav-icon">{item.icon}</div>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <NavLink
            to="/home"
            className="admin-nav-item"
            title={collapsed ? "View Site" : undefined}
          >
            <div className="admin-nav-icon">
              <FiHome />
            </div>

            {!collapsed && <span>View Site</span>}
          </NavLink>
        </div>
      </aside>

      {/* Main Area */}
      <main className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-breadcrumb">
            Admin / <span className="admin-breadcrumb-accent">{currentRouteName}</span>
          </div>

          <div className="admin-topbar-right">
            <button className="admin-theme-toggle" onClick={toggleTheme}>
              {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            <div className="admin-profile">
              <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--text-secondary)" }}>
                {user?.name}
              </span>
            </div>
            <button className="admin-logout-btn" onClick={handleLogout}>
              <FiLogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
