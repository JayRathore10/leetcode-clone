import { FiSettings, FiDatabase, FiShield, FiBell } from "react-icons/fi";

export function AdminSettings() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Settings</h1>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
        gap: "24px" 
      }}>
        
        <div style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <FiSettings size={24} color="var(--brand-500)" />
            <h2 style={{ fontSize: "1.1rem", margin: 0 }}>General Settings</h2>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Configure basic platform settings, including site name, description, and contact email.
          </p>
          <button className="admin-btn-secondary" style={{ width: "fit-content", marginTop: "auto" }}>
            Configure
          </button>
        </div>

        <div style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <FiShield size={24} color="var(--brand-500)" />
            <h2 style={{ fontSize: "1.1rem", margin: 0 }}>Security</h2>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Manage session timeouts, password policies, and admin access controls.
          </p>
          <button className="admin-btn-secondary" style={{ width: "fit-content", marginTop: "auto" }}>
            Manage Security
          </button>
        </div>

        <div style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <FiDatabase size={24} color="var(--brand-500)" />
            <h2 style={{ fontSize: "1.1rem", margin: 0 }}>Database & Cache</h2>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Clear application cache, trigger backups, and view database usage statistics.
          </p>
          <button className="admin-btn-secondary" style={{ width: "fit-content", marginTop: "auto" }}>
            Manage Database
          </button>
        </div>

        <div style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <FiBell size={24} color="var(--brand-500)" />
            <h2 style={{ fontSize: "1.1rem", margin: 0 }}>Notifications</h2>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Configure email providers and system notification templates for users.
          </p>
          <button className="admin-btn-secondary" style={{ width: "fit-content", marginTop: "auto" }}>
            Configure Notifications
          </button>
        </div>

      </div>
    </div>
  );
}
