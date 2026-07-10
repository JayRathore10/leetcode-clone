import { useState } from "react";
import axios from "axios";
import { FiThumbsUp, FiMessageSquare, FiFlag, FiEdit2, FiTrash2 } from "react-icons/fi";

import { Reply } from "../../configs/discussion.types";
import { env } from "../../configs/env.config";
import "./ReplyItem.css";

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

interface ReplyItemProps {
  reply: Reply;
  currentUserId?: string;
  onReplyAdded: () => void;
  onReplyDeleted: (id: string) => void;
  onReplyUpdated: (id: string, newContent: string) => void;
}

export function ReplyItem({
  reply,
  currentUserId,
  onReplyAdded,
  onReplyDeleted,
  onReplyUpdated,
}: ReplyItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(reply.content);

  const [likesCount, setLikesCount] = useState(reply.likes.length);
  const [isLiked, setIsLiked] = useState(currentUserId ? reply.likes.includes(currentUserId) : false);

  const handleLike = async () => {
    if (!currentUserId) return;
    try {
      const res = await axios.post(
        `${env.backendUrl}/api/reply/${reply._id}/like`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setIsLiked(!isLiked);
        setLikesCount(res.data.likes);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReport = async () => {
    if (!currentUserId) return;
    try {
      const res = await axios.post(
        `${env.backendUrl}/api/reply/${reply._id}/report`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        alert("Reply reported successfully");
      }
    } catch (error) {
      console.error(error);
      alert("Already reported or an error occurred.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this reply?")) return;
    try {
      const res = await axios.delete(
        `${env.backendUrl}/api/reply/${reply._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        onReplyDeleted(reply._id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const submitReply = async () => {
    if (!replyContent.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `${env.backendUrl}/api/reply`,
        {
          discussionId: reply.discussion,
          content: replyContent,
          parentReply: reply._id,
        },
        { withCredentials: true }
      );
      if (res.data.success) {
        setReplyContent("");
        setShowReplyForm(false);
        onReplyAdded();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitEdit = async () => {
    if (!editContent.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await axios.put(
        `${env.backendUrl}/api/reply/${reply._id}`,
        { content: editContent },
        { withCredentials: true }
      );
      if (res.data.success) {
        setIsEditing(false);
        onReplyUpdated(reply._id, editContent);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAuthor = currentUserId === reply.author._id;

  return (
    <div className="reply-item">
      <div className="reply-thread-line">
        <img
          src={reply.author.profilePic || "/default-avatar.png"}
          alt={reply.author.username}
          className="reply-avatar"
        />
      </div>

      <div className="reply-body">
        <div className="reply-header">
          <span className="reply-username">{reply.author.name || reply.author.username}</span>
          <span className="reply-dot">•</span>
          <span className="reply-time">
            {formatTimeAgo(reply.createdAt)}
          </span>
          {reply.edited && <span className="reply-edited-badge">(edited)</span>}
        </div>

        {isEditing ? (
          <div className="reply-edit-wrap">
            <textarea
              className="reply-edit-input"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div className="reply-edit-actions">
              <button className="reply-cancel-btn" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button className="reply-submit-btn" onClick={submitEdit} disabled={isSubmitting}>
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="reply-content">{reply.content}</div>
        )}

        <div className="reply-actions">
          <button
            className={`reply-action-btn ${isLiked ? "liked" : ""}`}
            onClick={handleLike}
            title="Like"
          >
            <FiThumbsUp /> {likesCount > 0 && likesCount}
          </button>
          
          {/* Note: In a flat UI we don't necessarily nest replies deeply, but we can have a reply button */}
          <button
            className="reply-action-btn"
            onClick={() => setShowReplyForm(!showReplyForm)}
            title="Reply"
          >
            <FiMessageSquare />
          </button>

          {isAuthor ? (
            <>
              <button
                className="reply-action-btn"
                onClick={() => setIsEditing(!isEditing)}
                title="Edit"
              >
                <FiEdit2 />
              </button>
              <button
                className="reply-action-btn reply-action-btn--danger"
                onClick={handleDelete}
                title="Delete"
              >
                <FiTrash2 />
              </button>
            </>
          ) : (
            <button
              className="reply-action-btn reply-action-btn--danger"
              onClick={handleReport}
              title="Report"
            >
              <FiFlag />
            </button>
          )}
        </div>

        {showReplyForm && (
          <div className="reply-composer">
            <textarea
              className="reply-composer-input"
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <div className="reply-composer-actions">
              <button className="reply-submit-btn" onClick={submitReply} disabled={isSubmitting}>
                Reply
              </button>
              <button className="reply-cancel-btn" onClick={() => setShowReplyForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
