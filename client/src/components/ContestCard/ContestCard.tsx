import { useNavigate } from "react-router-dom";
import { Contest } from "../../configs/contest.types";
import { FiClock, FiUsers, FiCode } from "react-icons/fi";
import "./ContestCard.css";

interface ContestCardProps {
  contest: Contest;
  isRegistered?: boolean;
}

export function ContestCard({ contest, isRegistered = false }: ContestCardProps) {
  const navigate = useNavigate();
  
  const startDate = new Date(contest.startTime);
  const isUpcoming = contest.status === "Upcoming";
  const isRunning = contest.status === "Running";

  const getStatusClass = () => {
    switch (contest.status) {
      case "Upcoming":
        return "status-upcoming";
      case "Running":
        return "status-running";
      case "Ended":
        return "status-ended";
      default:
        return "";
    }
  };

  return (
    <div className={`contest-card ${getStatusClass()}`}>
      <div className="contest-card-header">
        <h3 className="contest-title">{contest.title}</h3>
        <span className={`contest-badge ${getStatusClass()}`}>
          {contest.status}
        </span>
      </div>

      <p className="contest-desc">{contest.description}</p>

      <div className="contest-meta">
        <div className="meta-item">
          <FiClock />
          <span>{startDate.toLocaleString()}</span>
        </div>
        <div className="meta-item">
          <FiClock />
          <span>{contest.duration} mins</span>
        </div>
        <div className="meta-item">
          <FiCode />
          <span>{contest.problems.length} Problems</span>
        </div>
        <div className="meta-item">
          <FiUsers />
          <span>{contest.participants.length} Registered</span>
        </div>
      </div>

      <div className="contest-card-footer">
        {isRegistered && isUpcoming && (
          <span className="registered-text">You are registered</span>
        )}
        
        <button
          className={`contest-action-btn ${isRunning ? "btn-primary" : "btn-secondary"}`}
          onClick={() => navigate(`/contest/${contest._id}`)}
        >
          {isUpcoming ? "View Details" : isRunning ? "Enter Contest" : "View Results"}
        </button>
      </div>
    </div>
  );
}
