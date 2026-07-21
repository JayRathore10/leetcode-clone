import {
  FiSettings,
  FiDatabase,
  FiShield,
  FiBell,
} from "react-icons/fi";
import "./AdminSettings.css";

export function AdminSettings() {
  return (
    <div className="admin-settings">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Settings</h1>
      </div>

      <div className="admin-settings-grid">
        <div className="admin-settings-card">
          <div className="admin-settings-card-header">
            <FiSettings className="admin-settings-icon" />
            <h2>General Settings</h2>
          </div>

          <p>
            Configure basic platform settings, including site name,
            description, and contact email.
          </p>

          <button className="admin-btn-secondary">
            Configure
          </button>
        </div>

        <div className="admin-settings-card">
          <div className="admin-settings-card-header">
            <FiShield className="admin-settings-icon" />
            <h2>Security</h2>
          </div>

          <p>
            Manage session timeouts, password policies, and admin
            access controls.
          </p>

          <button className="admin-btn-secondary">
            Manage Security
          </button>
        </div>

        <div className="admin-settings-card">
          <div className="admin-settings-card-header">
            <FiDatabase className="admin-settings-icon" />
            <h2>Database &amp; Cache</h2>
          </div>

          <p>
            Clear application cache, trigger backups, and view
            database usage statistics.
          </p>

          <button className="admin-btn-secondary">
            Manage Database
          </button>
        </div>

        <div className="admin-settings-card">
          <div className="admin-settings-card-header">
            <FiBell className="admin-settings-icon" />
            <h2>Notifications</h2>
          </div>

          <p>
            Configure email providers and system notification
            templates for users.
          </p>

          <button className="admin-btn-secondary">
            Configure Notifications
          </button>
        </div>
      </div>
    </div>
  );
}