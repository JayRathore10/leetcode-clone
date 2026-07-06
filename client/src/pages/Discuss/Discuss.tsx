import {  useNavigate } from "react-router-dom";
import "./Discuss.css";

export function Discuss() {
  const navigate = useNavigate();

  // have to make disucss section

  return (
    <div className="discuss-page">
      <div className="discuss-card">
        <h1>Discuss</h1>
        <p className="discuss-title">Coming Soon</p>
        <p className="discuss-text">
          Community discussions, problem explanations, and shared solutions
          will be available soon.
        </p>

        <button
          className="back-home-btn"
          onClick={()=> navigate("/home")}
        >
           ← Back to Home
        </button>

      </div>
    </div>
  );
}
