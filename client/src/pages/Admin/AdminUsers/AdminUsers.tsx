import { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { adminService } from "../../../services/admin.service";
import { User } from "../../../configs/admin.types";
import "./AdminUsers.css";

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllUsers();
      if (res.success && res.data?.users) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: "user" | "admin") => {
    try {
      const res = await adminService.updateUserRole(userId, newRole);
      if (res.success) {
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Failed to update user role");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    
    try {
      const res = await adminService.deleteUser(id);
      if (res.success) {
        setUsers(users.filter(u => u._id !== id));
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="admin-users">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Users</h1>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <div className="admin-loading">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="admin-empty">No users found.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Role</th>
                <th style={{ width: "80px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {user.profilePic ? (
                        <img 
                          src={user.profilePic.startsWith("http") ? user.profilePic : `http://localhost:5000/images/${user.profilePic}`} 
                          alt={user.username} 
                          style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                        />
                      ) : (
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "var(--brand-500)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "14px" }}>
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 600 }}>{user.name || user.username}</div>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select 
                      className="admin-role-select"
                      value={user.role || "user"}
                      onChange={(e) => handleRoleChange(user._id, e.target.value as "user" | "admin")}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <div className="admin-actions" style={{ justifyContent: "flex-end" }}>
                      <button
                        className="admin-icon-btn delete"
                        onClick={() => handleDelete(user._id)}
                        title="Delete User"
                        disabled={user.role === "admin"}
                        style={{ opacity: user.role === "admin" ? 0.5 : 1, cursor: user.role === "admin" ? "not-allowed" : "pointer" }}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
