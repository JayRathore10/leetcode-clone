import { useNavigate } from "react-router-dom";
import "../styles/Leaderboard.css";

export function Leaderboard() {

  const navigate = useNavigate();

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-card">
        <h1>Leaderboard</h1>
        <p className="leaderboard-title">Coming Soon</p>
        <p className="leaderboard-text">
          Global rankings, ratings, and competitive statistics
          will be introduced shortly.
        </p>
        <button
          className="back-home-btn"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>
      </div>  
    </div>
  );
}
