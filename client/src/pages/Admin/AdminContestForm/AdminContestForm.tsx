import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { env } from "../../../configs/env.config";
import { adminService } from "../../../services/admin.service";
import "./AdminContestForm.css";
// Reuse form styles
import "../AdminProblemForm/AdminProblemForm.css";

export function AdminContestForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    duration: 120,
    isPublic: true,
    problems: "",
  });
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditing) {
      const fetchContest = async () => {
        try {
          const res = await axios.get(`${env.backendUrl}/api/contest/${id}`);
          if (res.data.success) {
            const c = res.data.contest;
            setFormData({
              title: c.title || "",
              description: c.description || "",
              startTime: c.startTime ? new Date(c.startTime).toISOString().slice(0, 16) : "",
              endTime: c.endTime ? new Date(c.endTime).toISOString().slice(0, 16) : "",
              duration: c.duration || 120,
              isPublic: c.isPublic ?? true,
              problems: c.problems?.map((p: any) => p._id || p).join(", ") || "",
            });
          }
        } catch (err: any) {
          setError(err.response?.data?.message || "Failed to load contest");
        } finally {
          setLoading(false);
        }
      };
      fetchContest();
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: formData.title,
      description: formData.description,
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
      duration: Number(formData.duration),
      isPublic: formData.isPublic,
      problems: formData.problems.split(",").map(p => p.trim()).filter(Boolean),
    };

    try {
      if (isEditing) {
        await adminService.updateContest(id!, payload);
      } else {
        await adminService.createContest(payload);
      }
      navigate("/admin/contests");
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: "24px" }}>Loading...</div>;

  return (
    <div className="admin-contest-form-container admin-form-container">
      <div className="admin-page-header" style={{ marginBottom: "24px" }}>
        <h1 className="admin-page-title">{isEditing ? "Edit Contest" : "Add Contest"}</h1>
      </div>

      {error && (
        <div style={{ color: "var(--danger)", marginBottom: "16px", padding: "12px", backgroundColor: "var(--danger-bg)", borderRadius: "var(--radius-sm)" }}>
          {error}
        </div>
      )}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-group">
          <label className="admin-form-label">Title</label>
          <input
            type="text"
            name="title"
            className="admin-form-input"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Description</label>
          <textarea
            name="description"
            className="admin-form-textarea"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
          />
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">Start Time</label>
            <input
              type="datetime-local"
              name="startTime"
              className="admin-form-input"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">End Time</label>
            <input
              type="datetime-local"
              name="endTime"
              className="admin-form-input"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              className="admin-form-input"
              value={formData.duration}
              onChange={handleChange}
              required
              min={1}
            />
          </div>
          <div className="admin-form-group" style={{ flexDirection: "row", alignItems: "center", gap: "8px", marginTop: "28px" }}>
            <input
              type="checkbox"
              name="isPublic"
              id="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
              style={{ width: "18px", height: "18px" }}
            />
            <label htmlFor="isPublic" className="admin-form-label" style={{ cursor: "pointer" }}>Is Public</label>
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Problems (comma separated Object IDs)</label>
          <input
            type="text"
            name="problems"
            className="admin-form-input"
            value={formData.problems}
            onChange={handleChange}
            placeholder="60d5ecb8b392d72f1c8b4567, 60d5ecb8b392d72f1c8b4568"
          />
        </div>

        <div className="admin-form-actions">
          <button type="button" className="admin-btn-secondary" onClick={() => navigate("/admin/contests")}>
            Cancel
          </button>
          <button type="submit" className="admin-btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Contest"}
          </button>
        </div>
      </form>
    </div>
  );
}
