import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { env } from "../../../configs/env.config";
import { adminService } from "../../../services/admin.service";
import { Question } from "../../../configs/admin.types";
import "./AdminProblems.css";

export function AdminProblems() {
  const [problems, setProblems] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${env.backendUrl}/api/question/all`);
      if (res.data.success) {
        setProblems(res.data.questions);
      }
    } catch (error) {
      console.error("Error fetching problems:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this problem?")) return;
    
    try {
      const res = await adminService.deleteQuestion(id);
      if (res.success) {
        setProblems(problems.filter(p => p._id !== id));
      }
    } catch (error) {
      console.error("Error deleting problem:", error);
      alert("Failed to delete problem");
    }
  };

  return (
    <div className="admin-problems">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Problems</h1>
        <button
          className="admin-btn-primary"
          onClick={() => navigate("/admin/problems/new")}
        >
          <FiPlus /> Add Problem
        </button>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <div className="admin-loading">Loading problems...</div>
        ) : problems.length === 0 ? (
          <div className="admin-empty">No problems found.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Tags</th>
                <th style={{ width: "120px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem) => (
                <tr key={problem._id}>
                  <td style={{ fontWeight: 500 }}>{problem.title}</td>
                  <td>
                    <span className={`admin-badge ${problem.difficulty?.toLowerCase()}`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                      {problem.tags?.slice(0, 3).map((tag, idx) => (
                        <span key={idx} style={{ fontSize: "0.8rem", padding: "2px 6px", backgroundColor: "var(--bg-muted)", borderRadius: "4px" }}>
                          {tag}
                        </span>
                      ))}
                      {problem.tags?.length > 3 && (
                        <span style={{ fontSize: "0.8rem", padding: "2px 6px" }}>
                          +{problem.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="admin-actions" style={{ justifyContent: "flex-end" }}>
                      <button
                        className="admin-icon-btn edit"
                        onClick={() => navigate(`/admin/problems/${problem._id}/edit`)}
                        title="Edit"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        className="admin-icon-btn delete"
                        onClick={() => handleDelete(problem._id)}
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
        )}
      </div>
    </div>
  );
}
