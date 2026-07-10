import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft, FiThumbsUp, FiBookmark, FiFlag, FiTrash2 } from "react-icons/fi";

import { Header } from "../../components/Header/Header";
import { ReplyItem } from "../../components/ReplyItem/ReplyItem";
import { env } from "../../configs/env.config";
import { Discussion, Reply, DiscussionDetailResponse, RepliesResponse } from "../../configs/discussion.types";
import { LoginProps } from "../Login/Login";
import "./DiscussDetail.css";

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

export function DiscussDetail({ isloggedIn }: LoginProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // We need current user's ID for liking/deleting logic.
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    // A quick way to get current user info if needed, or rely on auth state.
    // For simplicity, we just fetch /api/auth/me if logged in.
    if (isloggedIn) {
      axios.get(`${env.backendUrl}/api/auth/me`, { withCredentials: true })
        .then(res => setCurrentUserId(res.data.user._id))
        .catch(err => console.error("Could not fetch user", err));
    }
  }, [isloggedIn]);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const [discRes, repliesRes] = await Promise.all([
        axios.get<DiscussionDetailResponse>(`${env.backendUrl}/api/discussion/${id}`, { withCredentials: true }),
        axios.get<RepliesResponse>(`${env.backendUrl}/api/reply/discussion/${id}`, { withCredentials: true })
      ]);

      if (discRes.data.success) {
        setDiscussion(discRes.data.discussion);
      }
      if (repliesRes.data.success) {
        // Build a flat list or threaded list depending on your preference.
        // The API returns all replies. We will just list them.
        setReplies(repliesRes.data.replies);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load discussion.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLikeDiscussion = async () => {
    if (!discussion) return;
    try {
      const res = await axios.post(`${env.backendUrl}/api/discussion/${discussion._id}/like`, {}, { withCredentials: true });
      if (res.data.success) {
        setDiscussion(prev => prev ? { ...prev, likes: res.data.message.includes("unliked") ? prev.likes.filter(uid => uid !== currentUserId) : [...prev.likes, currentUserId] } : null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookmark = async () => {
    if (!discussion) return;
    try {
      const res = await axios.post(`${env.backendUrl}/api/discussion/${discussion._id}/bookmark`, {}, { withCredentials: true });
      if (res.data.success) {
        setDiscussion(prev => prev ? { ...prev, bookmarks: res.data.message.includes("removed") ? prev.bookmarks.filter(uid => uid !== currentUserId) : [...prev.bookmarks, currentUserId] } : null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDiscussion = async () => {
    if (!discussion) return;
    if (!window.confirm("Delete this discussion?")) return;
    try {
      const res = await axios.delete(`${env.backendUrl}/api/discussion/${discussion._id}`, { withCredentials: true });
      if (res.data.success) {
        navigate("/discuss");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReportDiscussion = async () => {
    if (!discussion) return;
    try {
      const res = await axios.post(`${env.backendUrl}/api/discussion/${discussion._id}/report`, {}, { withCredentials: true });
      if (res.data.success) {
        alert("Discussion reported.");
      }
    } catch (err) {
      console.error(err);
      alert("Already reported or error occurred.");
    }
  };

  const handlePostReply = async () => {
    if (!replyContent.trim() || !discussion) return;
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${env.backendUrl}/api/reply`, {
        discussionId: discussion._id,
        content: replyContent
      }, { withCredentials: true });

      if (res.data.success) {
        setReplyContent("");
        fetchData(); // Reload replies
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header isloggedIn={isloggedIn!} />
        <main className="disc-detail-page">
          <div className="disc-detail-loading">Loading discussion...</div>
        </main>
      </>
    );
  }

  if (error || !discussion) {
    return (
      <>
        <Header isloggedIn={isloggedIn!} />
        <main className="disc-detail-page">
          <div className="disc-detail-error">{error || "Discussion not found."}</div>
        </main>
      </>
    );
  }

  const avatarSrc = discussion.author.profilePic
    ? `${env.backendUrl}/images/${discussion.author.profilePic}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
      discussion.author.username
    )}&background=0077B6&color=fff&size=64`;

  const isAuthor = currentUserId === discussion.author._id;
  const isLiked = currentUserId ? discussion.likes.includes(currentUserId) : false;
  const isBookmarked = currentUserId ? discussion.bookmarks.includes(currentUserId) : false;

  return (
    <>
      <Header isloggedIn={isloggedIn!} />
      <main className="disc-detail-page">
        <button className="disc-detail-back" onClick={() => navigate("/discuss")}>
          <FiArrowLeft /> Back to Discussions
        </button>

        <article className="disc-post">
          <div className="disc-post-header">
            <div>
              <h1 className="disc-post-title">{discussion.title}</h1>
              <div className="disc-post-badges">
                <span className="disc-post-cat">{discussion.category}</span>
                {discussion.tags.map(tag => (
                  <span key={tag} className="disc-post-tag">#{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="disc-post-meta">
            <div className="disc-post-author">
              <img
                src={avatarSrc}
                alt={discussion.author.username}
                className="disc-post-avatar"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    discussion.author.username
                  )}&background=0077B6&color=fff&size=64`;
                }}
              />
              <span className="disc-post-author-name">{discussion.author.name || discussion.author.username}</span>
              <span className="disc-post-time">• {formatTimeAgo(discussion.createdAt)}</span>
              <span className="disc-post-time">• {discussion.views} views</span>
            </div>
          </div>

          <div className="disc-post-content">
            {discussion.content}
          </div>

          <div className="disc-post-actions">
            <button className={`disc-post-btn ${isLiked ? "active" : ""}`} onClick={handleLikeDiscussion}>
              <FiThumbsUp /> {discussion.likes.length}
            </button>
            <button className={`disc-post-btn ${isBookmarked ? "active" : ""}`} onClick={handleBookmark}>
              <FiBookmark /> Bookmark
            </button>

            {isAuthor ? (
              <>
                <button className="disc-post-btn disc-post-btn--danger" onClick={handleDeleteDiscussion}>
                  <FiTrash2 /> Delete
                </button>
              </>
            ) : (
              <button className="disc-post-btn disc-post-btn--danger" onClick={handleReportDiscussion}>
                <FiFlag /> Report
              </button>
            )}
          </div>
        </article>

        <section className="disc-replies-section">
          <h2 className="disc-replies-header">Replies ({replies.length})</h2>

          <div className="disc-reply-composer">
            <textarea
              className="disc-reply-input"
              placeholder="Add a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <div className="disc-reply-actions">
              <button
                className="disc-reply-submit"
                onClick={handlePostReply}
                disabled={isSubmitting || !replyContent.trim()}
              >
                {isSubmitting ? "Posting..." : "Post Reply"}
              </button>
            </div>
          </div>

          <div className="disc-replies-list">
            {replies.map(reply => (
              <ReplyItem
                key={reply._id}
                reply={reply}
                currentUserId={currentUserId}
                onReplyAdded={fetchData}
                onReplyDeleted={() => setReplies(prev => prev.filter(r => r._id !== reply._id))}
                onReplyUpdated={(id, content) => setReplies(prev => prev.map(r => r._id === id ? { ...r, content, edited: true } : r))}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
