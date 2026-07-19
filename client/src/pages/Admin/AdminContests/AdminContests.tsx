import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { env } from "../../../configs/env.config";
import { adminService } from "../../../services/admin.service";
import { Contest } from "../../../configs/contest.types";
import "./AdminContests.css";

export function AdminContests() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchContests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${env.backendUrl}/api/contest/`);
      if (res.data.success) {
        setContests(res.data.contests);
      }
    } catch (error) {
      console.error("Error fetching contests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this contest?")) return;
    
    try {
      const res = await adminService.deleteContest(id);
      if (res.success) {
        setContests(contests.filter(c => c._id !== id));
      }
    } catch (error) {
      console.error("Error deleting contest:", error);
      alert("Failed to delete contest");
    }
  };

  return (
    <div className="admin-contests">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Contests</h1>
        <button
          className="admin-btn-primary"
          onClick={() => navigate("/admin/contests/new")}
        >
          <FiPlus /> Add Contest
        </button>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <div className="admin-loading">Loading contests...</div>
        ) : contests.length === 0 ? (
          <div className="admin-empty">No contests found.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Start Time</th>
                <th>Duration</th>
                <th style={{ width: "120px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contests.map((contest) => (
                <tr key={contest._id}>
                  <td style={{ fontWeight: 500 }}>{contest.title}</td>
                  <td>
                    <span className={`admin-badge ${contest.status?.toLowerCase()}`}>
                      {contest.status}
                    </span>
                  </td>
                  <td>{new Date(contest.startTime).toLocaleString()}</td>
                  <td>{contest.duration} mins</td>
                  <td>
                    <div className="admin-actions" style={{ justifyContent: "flex-end" }}>
                      <button
                        className="admin-icon-btn edit"
                        onClick={() => navigate(`/admin/contests/${contest._id}/edit`)}
                        title="Edit"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        className="admin-icon-btn delete"
                        onClick={() => handleDelete(contest._id)}
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
