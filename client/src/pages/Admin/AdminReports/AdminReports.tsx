import { useEffect, useState } from "react";
import { FiCheck, FiTrash2 } from "react-icons/fi";
import { adminService } from "../../../services/admin.service";
import "./AdminReports.css";

export function AdminReports() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [discussions, setDiscussions] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [discRes, repRes] = await Promise.all([
        adminService.getReportedDiscussions(),
        adminService.getReportedReplies(),
      ]);

      if (discRes.success) setDiscussions(discRes.discussions);
      if (repRes.success) setReplies(repRes.replies);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleResolveDiscussion = async (id: string) => {
    try {
      const res = await adminService.resolveDiscussionReport(id);
      if (res.success) {
        setDiscussions(discussions.filter(d => d._id !== id));
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Failed to resolve report");
    }
  };

  const handleDeleteDiscussion = async (id: string) => {
    if (!window.confirm("Delete this discussion?")) return;
    try {
      const res = await adminService.deleteDiscussion(id);
      if (res.success) {
        setDiscussions(discussions.filter(d => d._id !== id));
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Failed to delete discussion");
    }
  };

  const handleResolveReply = async (id: string) => {
    try {
      const res = await adminService.resolveReplyReport(id);
      if (res.success) {
        setReplies(replies.filter(r => r._id !== id));
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Failed to resolve report");
    }
  };

  const handleDeleteReply = async (id: string) => {
    if (!window.confirm("Delete this reply?")) return;
    try {
      const res = await adminService.deleteReply(id);
      if (res.success) {
        setReplies(replies.filter(r => r._id !== id));
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Failed to delete reply");
    }
  };

  if (loading) return <div style={{ padding: "24px" }}>Loading reports...</div>;

  return (
    <div className="admin-reports">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Reported Content</h1>
      </div>

      <div className="admin-reports-section">
        <h2 className="admin-section-title">Reported Discussions ({discussions.length})</h2>
        <div className="admin-table-container">
          {discussions.length === 0 ? (
            <div className="admin-empty" style={{ padding: "20px" }}>No reported discussions.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Reports</th>
                  <th style={{ width: "120px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {discussions.map((disc) => (
                  <tr key={disc._id}>
                    <td style={{ fontWeight: 500 }}>{disc.title}</td>
                    <td>{disc.author?.username}</td>
                    <td>{disc.reportedBy?.length || 1}</td>
                    <td>
                      <div className="admin-actions" style={{ justifyContent: "flex-end" }}>
                        <button
                          className="admin-icon-btn"
                          style={{ color: "#10b981" }}
                          onClick={() => handleResolveDiscussion(disc._id)}
                          title="Resolve Report"
                        >
                          <FiCheck size={16} />
                        </button>
                        <button
                          className="admin-icon-btn delete"
                          onClick={() => handleDeleteDiscussion(disc._id)}
                          title="Delete Discussion"
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

      <div className="admin-reports-section">
        <h2 className="admin-section-title">Reported Replies ({replies.length})</h2>
        <div className="admin-table-container">
          {replies.length === 0 ? (
            <div className="admin-empty" style={{ padding: "20px" }}>No reported replies.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Content</th>
                  <th>Discussion</th>
                  <th>Author</th>
                  <th style={{ width: "120px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {replies.map((rep) => (
                  <tr key={rep._id}>
                    <td style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {rep.content}
                    </td>
                    <td>{rep.discussion?.title}</td>
                    <td>{rep.author?.username}</td>
                    <td>
                      <div className="admin-actions" style={{ justifyContent: "flex-end" }}>
                        <button
                          className="admin-icon-btn"
                          style={{ color: "#10b981" }}
                          onClick={() => handleResolveReply(rep._id)}
                          title="Resolve Report"
                        >
                          <FiCheck size={16} />
                        </button>
                        <button
                          className="admin-icon-btn delete"
                          onClick={() => handleDeleteReply(rep._id)}
                          title="Delete Reply"
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
    </div>
  );
}
