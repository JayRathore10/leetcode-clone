import { useEffect, useState } from "react";
import { FiTrash2, FiLock, FiUnlock, FiStar } from "react-icons/fi";
import { adminService } from "../../../services/admin.service";
import "./AdminDiscussions.css";

export function AdminDiscussions() {
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllDiscussions(page, 20);
      if (res.success) {
        setDiscussions(res.discussions);
        setTotalPages(res.totalPages);
      }
    } catch (error) {
      console.error("Error fetching discussions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, [page]);

  const handleTogglePin = async (id: string) => {
    try {
      const res = await adminService.togglePinDiscussion(id);
      if (res.success) {
        setDiscussions(discussions.map(d => d._id === id ? { ...d, pinned: res.pinned } : d));
      }
    } catch (error) {
      console.error("Error toggling pin:", error);
      alert("Failed to pin/unpin");
    }
  };

  const handleToggleLock = async (id: string) => {
    try {
      const res = await adminService.toggleLockDiscussion(id);
      if (res.success) {
        setDiscussions(discussions.map(d => d._id === id ? { ...d, locked: res.locked } : d));
      }
    } catch (error) {
      console.error("Error toggling lock:", error);
      alert("Failed to lock/unlock");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this discussion?")) return;
    try {
      const res = await adminService.deleteDiscussion(id);
      if (res.success) {
        setDiscussions(discussions.filter(d => d._id !== id));
      }
    } catch (error) {
      console.error("Error deleting discussion:", error);
      alert("Failed to delete discussion");
    }
  };

  return (
    <div className="admin-discussions">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Discussions</h1>
      </div>

      <div className="admin-table-container">
        {loading && discussions.length === 0 ? (
          <div className="admin-loading">Loading discussions...</div>
        ) : discussions.length === 0 ? (
          <div className="admin-empty">No discussions found.</div>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Replies / Views</th>
                  <th>Status</th>
                  <th style={{ width: "120px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {discussions.map((disc) => (
                  <tr key={disc._id}>
                    <td style={{ fontWeight: 500, maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {disc.title}
                    </td>
                    <td>{disc.author?.username || "Unknown"}</td>
                    <td>
                      <span className="admin-badge" style={{ backgroundColor: "var(--bg-muted)", color: "var(--text-secondary)" }}>
                        {disc.category}
                      </span>
                    </td>
                    <td>{disc.replyCount} / {disc.views}</td>
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {disc.pinned && <span className="admin-badge" style={{ backgroundColor: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" }}>Pinned</span>}
                        {disc.locked && <span className="admin-badge" style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#ef4444" }}>Locked</span>}
                        {disc.reported && <span className="admin-badge" style={{ backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>Reported</span>}
                      </div>
                    </td>
                    <td>
                      <div className="admin-actions" style={{ justifyContent: "flex-end" }}>
                        <button
                          className="admin-icon-btn"
                          style={{ color: disc.pinned ? "#3b82f6" : "inherit" }}
                          onClick={() => handleTogglePin(disc._id)}
                          title={disc.pinned ? "Unpin" : "Pin"}
                        >
                          <FiStar size={16} />
                        </button>
                        <button
                          className="admin-icon-btn"
                          style={{ color: disc.locked ? "#ef4444" : "inherit" }}
                          onClick={() => handleToggleLock(disc._id)}
                          title={disc.locked ? "Unlock" : "Lock"}
                        >
                          {disc.locked ? <FiLock size={16} /> : <FiUnlock size={16} />}
                        </button>
                        <button
                          className="admin-icon-btn delete"
                          onClick={() => handleDelete(disc._id)}
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {totalPages > 1 && (
              <div className="admin-pagination">
                <button 
                  className="admin-pagination-btn" 
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  Previous
                </button>
                <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                  Page {page} of {totalPages}
                </span>
                <button 
                  className="admin-pagination-btn" 
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
