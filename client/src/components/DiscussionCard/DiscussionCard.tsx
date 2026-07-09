import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEye, FiThumbsUp, FiMessageSquare, FiMapPin } from "react-icons/fi";
import { Discussion } from "../../configs/discussion.types";
import "./DiscussionCard.css";

interface DiscussionCardProps {
  discussion: Discussion;
  index: number;
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export function DiscussionCard({ discussion, index }: DiscussionCardProps) {
  const navigate = useNavigate();

  const avatarSrc = discussion.author.profilePic
    ? discussion.author.profilePic
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(discussion.author.username)}&background=0077B6&color=fff&size=64`;

  return (
    <motion.div
      className="disc-card"
      onClick={() => navigate(`/discuss/${discussion._id}`)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
    >
      {/* Author row */}
      <div className="disc-card-top">
        <img
          className="disc-card-avatar"
          src={avatarSrc}
          alt={discussion.author.username}
        />
        <span className="disc-card-author">{discussion.author.username}</span>
        <span className="disc-card-dot">·</span>
        <span className="disc-card-time">{timeAgo(discussion.createdAt)}</span>

        {discussion.pinned && (
          <span className="disc-card-pinned">
            <FiMapPin size={10} />
            Pinned
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="disc-card-title">{discussion.title}</h3>

      {/* Content preview */}
      <p className="disc-card-preview">{discussion.content}</p>

      {/* Tags */}
      {(discussion.tags.length > 0 || discussion.category) && (
        <div className="disc-card-tags">
          <span className="disc-card-category">{discussion.category}</span>
          {discussion.tags.map((tag) => (
            <span key={tag} className="disc-card-tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="disc-card-stats">
        <span className="disc-card-stat">
          <FiEye size={13} />
          {discussion.views}
        </span>
        <span className="disc-card-stat">
          <FiThumbsUp size={13} />
          {discussion.likes.length}
        </span>
        <span className="disc-card-stat">
          <FiMessageSquare size={13} />
          {discussion.replyCount}
        </span>
      </div>
    </motion.div>
  );
}

/* Skeleton variant */
export function DiscussionCardSkeleton() {
  return (
    <div className="disc-card-skeleton">
      <div className="disc-skel-row">
        <div className="disc-skel-circle" />
        <div className="disc-skel-line disc-skel-line--sm" />
      </div>
      <div className="disc-skel-line disc-skel-line--xl" />
      <div className="disc-skel-line disc-skel-line--lg" />
      <div className="disc-skel-line disc-skel-line--md" />
    </div>
  );
}
