import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye } from "react-icons/fi";
import { adminService } from "../../../services/admin.service";
import { Submission } from "../../../configs/admin.types";
import "./AdminSubmissions.css";

export function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [langFilter, setLangFilter] = useState("All");
  const [search, setSearch] = useState("");
  
  const navigate = useNavigate();

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await adminService.getSubmissions(page, 20, statusFilter, langFilter, search);
      if (res.success) {
        setSubmissions(res.submissions);
        setTotalPages(res.totalPages);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSubmissions();
    }, 500);
    return () => clearTimeout(timer);
  }, [page, statusFilter, langFilter, search]);

  return (
    <div className="admin-submissions">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Submissions</h1>
      </div>

      <div className="admin-filters">
        <div className="admin-filter-group">
          <label className="admin-filter-label">Search Problem</label>
          <input
            type="text"
            className="admin-filter-input"
            placeholder="Search by problem title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="admin-filter-group">
          <label className="admin-filter-label">Status</label>
          <select 
            className="admin-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Accepted">Accepted</option>
            <option value="WA">Wrong Answer</option>
            <option value="TLE">Time Limit Exceeded</option>
            <option value="MLE">Memory Limit Exceeded</option>
          </select>
        </div>
        <div className="admin-filter-group">
          <label className="admin-filter-label">Language</label>
          <select 
            className="admin-filter-select"
            value={langFilter}
            onChange={(e) => setLangFilter(e.target.value)}
          >
            <option value="All">All Languages</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>
      </div>

      <div className="admin-table-container">
        {loading && submissions.length === 0 ? (
          <div className="admin-loading">Loading submissions...</div>
        ) : submissions.length === 0 ? (
          <div className="admin-empty">No submissions found.</div>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>User</th>
                  <th>Problem</th>
                  <th>Language</th>
                  <th>Status</th>
                  <th style={{ width: "80px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub._id}>
                    <td>{new Date(sub.createdAt).toLocaleString()}</td>
                    <td style={{ fontWeight: 500 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {sub.userId?.profilePic ? (
                           <img 
                            src={sub.userId.profilePic.startsWith("http") ? sub.userId.profilePic : `http://localhost:5000/images/${sub.userId.profilePic}`} 
                            alt={sub.userId.username} 
                            style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover" }}
                          />
                        ) : null}
                        <span>{sub.userId?.username || "Unknown"}</span>
                      </div>
                    </td>
                    <td>{sub.questionId?.title || "Unknown Problem"}</td>
                    <td><span className="admin-badge" style={{ backgroundColor: "var(--bg-muted)", color: "var(--text-secondary)" }}>{sub.language}</span></td>
                    <td>
                      <span className="admin-badge" style={{ 
                        backgroundColor: sub.status === "Accepted" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                        color: sub.status === "Accepted" ? "#10b981" : "#ef4444"
                      }}>
                        {sub.status}
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions" style={{ justifyContent: "flex-end" }}>
                        <button
                          className="admin-icon-btn"
                          onClick={() => navigate(`/admin/submissions/${sub._id}`)}
                          title="View Code"
                        >
                          <FiEye size={16} />
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
