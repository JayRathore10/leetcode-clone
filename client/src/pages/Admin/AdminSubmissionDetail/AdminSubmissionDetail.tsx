import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Editor from "@monaco-editor/react";
import { adminService } from "../../../services/admin.service";
import "./AdminSubmissionDetail.css";

export function AdminSubmissionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const theme = localStorage.getItem("theme") === "dark" ? "vs-dark" : "light";

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const res = await adminService.getSubmissionDetail(id!);
        if (res.success) {
          setSubmission(res.submission);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load submission");
      } finally {
        setLoading(false);
      }
    };
    fetchSubmission();
  }, [id]);

  if (loading) return <div style={{ padding: "24px" }}>Loading...</div>;
  if (error) return <div style={{ padding: "24px", color: "var(--danger)" }}>{error}</div>;
  if (!submission) return <div style={{ padding: "24px" }}>Submission not found.</div>;

  return (
    <div className="admin-sub-detail-container">
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button 
            onClick={() => navigate(-1)} 
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", display: "flex", alignItems: "center" }}
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="admin-page-title">Submission Detail</h1>
        </div>
      </div>

      <div className="admin-sub-header-card">
        <h2 style={{ fontSize: "1.2rem", fontWeight: 600, margin: 0 }}>
          {submission.questionId?.title || "Unknown Problem"}
        </h2>
        <div className="admin-sub-info-grid">
          <div className="admin-sub-info-item">
            <span className="admin-sub-info-label">Status</span>
            <span className="admin-sub-info-value" style={{ 
              color: submission.status === "Accepted" ? "#10b981" : "#ef4444"
            }}>
              {submission.status}
            </span>
          </div>
          <div className="admin-sub-info-item">
            <span className="admin-sub-info-label">Language</span>
            <span className="admin-sub-info-value">{submission.language}</span>
          </div>
          <div className="admin-sub-info-item">
            <span className="admin-sub-info-label">Submitted By</span>
            <span className="admin-sub-info-value">User ID: {submission.userId}</span>
          </div>
          <div className="admin-sub-info-item">
            <span className="admin-sub-info-label">Time</span>
            <span className="admin-sub-info-value">{new Date(submission.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="admin-sub-code-card">
        <div className="admin-sub-code-header">
          <span className="admin-sub-code-title">Source Code</span>
        </div>
        <div className="admin-sub-editor-wrapper">
          <Editor
            height="100%"
            language={submission.language === "python" ? "python" : submission.language === "java" ? "java" : submission.language === "cpp" ? "cpp" : "javascript"}
            theme={theme}
            value={submission.code}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              padding: { top: 16 }
            }}
          />
        </div>
      </div>
    </div>
  );
}
