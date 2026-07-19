import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { env } from "../../../configs/env.config";
import { adminService } from "../../../services/admin.service";
import "./AdminProblemForm.css";

export function AdminProblemForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    tags: "",
    constraints: "",
    exampleInput: "",
    exampleOutput: "",
    exampleExplanation: ""
  });
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditing) {
      const fetchProblem = async () => {
        try {
          const res = await axios.get(`${env.backendUrl}/api/question/${id}`);
          if (res.data.success) {
            const q = res.data.question;
            setFormData({
              title: q.title || "",
              description: q.description || "",
              difficulty: q.difficulty || "Easy",
              tags: q.tags?.join(", ") || "",
              constraints: q.constraints?.join("\n") || "",
              exampleInput: q.example?.input || "",
              exampleOutput: q.example?.output || "",
              exampleExplanation: q.example?.explanation || ""
            });
          }
        } catch (err: any) {
          setError(err.response?.data?.message || "Failed to load problem");
        } finally {
          setLoading(false);
        }
      };
      fetchProblem();
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: formData.title,
      description: formData.description,
      difficulty: formData.difficulty,
      tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
      constraints: formData.constraints.split("\n").map(c => c.trim()).filter(Boolean),
      example: {
        input: formData.exampleInput,
        output: formData.exampleOutput,
        explanation: formData.exampleExplanation
      }
    };

    try {
      if (isEditing) {
        await adminService.updateQuestion(id!, payload);
      } else {
        await adminService.createQuestion(payload);
      }
      navigate("/admin/problems");
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: "24px" }}>Loading...</div>;

  return (
    <div className="admin-form-container">
      <div className="admin-page-header" style={{ marginBottom: "24px" }}>
        <h1 className="admin-page-title">{isEditing ? "Edit Problem" : "Add Problem"}</h1>
      </div>

      {error && (
        <div style={{ color: "var(--danger)", marginBottom: "16px", padding: "12px", backgroundColor: "var(--danger-bg)", borderRadius: "var(--radius-sm)" }}>
          {error}
        </div>
      )}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-row">
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
            <label className="admin-form-label">Difficulty</label>
            <select
              name="difficulty"
              className="admin-form-select"
              value={formData.difficulty}
              onChange={handleChange}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Description</label>
          <textarea
            name="description"
            className="admin-form-textarea"
            value={formData.description}
            onChange={handleChange}
            required
            rows={5}
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            className="admin-form-input"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Array, Hash Table, Dynamic Programming"
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Constraints (one per line)</label>
          <textarea
            name="constraints"
            className="admin-form-textarea"
            value={formData.constraints}
            onChange={handleChange}
            rows={4}
            placeholder="2 <= nums.length <= 10^4&#10;-10^9 <= nums[i] <= 10^9"
          />
        </div>

        <h3 style={{ marginTop: "16px", fontSize: "1.1rem" }}>Example</h3>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">Input</label>
            <input
              type="text"
              name="exampleInput"
              className="admin-form-input"
              value={formData.exampleInput}
              onChange={handleChange}
              placeholder='nums = [2,7,11,15], target = 9'
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Output</label>
            <input
              type="text"
              name="exampleOutput"
              className="admin-form-input"
              value={formData.exampleOutput}
              onChange={handleChange}
              placeholder='[0,1]'
            />
          </div>
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Explanation</label>
          <textarea
            name="exampleExplanation"
            className="admin-form-textarea"
            value={formData.exampleExplanation}
            onChange={handleChange}
            rows={2}
          />
        </div>

        <div className="admin-form-actions">
          <button type="button" className="admin-btn-secondary" onClick={() => navigate("/admin/problems")}>
            Cancel
          </button>
          <button type="submit" className="admin-btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Problem"}
          </button>
        </div>
      </form>
    </div>
  );
}
