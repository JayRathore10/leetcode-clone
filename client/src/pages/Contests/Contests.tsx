import { useNavigate } from "react-router-dom";
import "./Contests.css";

export function Contests() {
  const navigate = useNavigate();

  return (
    <div className="contests-page">
      <div className="coming-soon-card">
        <h1>Contests</h1>

        <p className="coming-soon-text">Coming Soon</p>

        <p className="coming-soon-subtext">
          Competitive programming contests will be available shortly.
          Stay tuned and keep practicing!
        </p>

        <button
          className="back-home-btn"
          onClick={() => navigate("/home")}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}


/*
  Make diff folder for diff pages and components. 
  Have to connect socket io and wirte infra for players connectivity. 
*/