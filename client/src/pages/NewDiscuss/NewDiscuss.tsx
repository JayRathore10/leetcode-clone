import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";

import { Header } from "../../components/Header/Header";
import { env } from "../../configs/env.config";
import { CATEGORIES, DiscussionCategory } from "../../configs/discussion.types";
import { LoginProps } from "../Login/Login";
import "./NewDiscuss.css";

export function NewDiscuss({ isloggedIn }: LoginProps) {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<DiscussionCategory>("General");
  const [tagsInput, setTagsInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const res = await axios.post(
        `${env.backendUrl}/api/discussion`,
        { title, content, category, tags },
        { withCredentials: true }
      );

      if (res.data.success) {
        navigate(`/discuss/${res.data.discussion._id}`);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to create discussion. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header isloggedIn={isloggedIn!} />
      <main className="new-disc-page">
        <div className="new-disc-header">
          <button 
            className="new-disc-cancel-btn" 
            style={{ width: "fit-content", padding: "0.5rem", border: "none", display: "flex", alignItems: "center", gap: "0.5rem" }} 
            onClick={() => navigate("/discuss")}
          >
            <FiArrowLeft /> Back to Discussions
          </button>
          <h1 className="new-disc-title">Start a New Discussion</h1>
          <p className="new-disc-subtitle">
            Ask a question, share an idea, or discuss a topic with the community.
          </p>
        </div>

        <form className="new-disc-form" onSubmit={handleSubmit}>
          {error && <div className="new-disc-error">{error}</div>}

          <div className="new-disc-group">
            <label htmlFor="title" className="new-disc-label">Title *</label>
            <input
              id="title"
              className="new-disc-input"
              type="text"
              placeholder="Keep it brief and descriptive"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={150}
            />
          </div>

          <div className="new-disc-group">
            <label htmlFor="category" className="new-disc-label">Category *</label>
            <select
              id="category"
              className="new-disc-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as DiscussionCategory)}
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="new-disc-group">
            <label htmlFor="tags" className="new-disc-label">Tags</label>
            <input
              id="tags"
              className="new-disc-input"
              type="text"
              placeholder="e.g. react, dynamic-programming, interview"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
            <span className="new-disc-tags-help">
              Separate tags with commas. Max 5 tags.
            </span>
          </div>

          <div className="new-disc-group">
            <label htmlFor="content" className="new-disc-label">Content *</label>
            <textarea
              id="content"
              className="new-disc-textarea"
              placeholder="What's on your mind? You can use Markdown."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="new-disc-actions">
            <button
              type="button"
              className="new-disc-cancel-btn"
              onClick={() => navigate("/discuss")}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="new-disc-submit-btn"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post Discussion"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
