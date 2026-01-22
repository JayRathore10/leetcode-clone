import "../styles/Profile.css";
import { Header } from "./Header";
export function Profile() {
  return (
    <>
    <Header />
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-left">
          <div className="avatar">JR</div>
          <div className="profile-info">
            <h1>Jay Rathore</h1>
            <p className="username">@jayrathore</p>
          </div>
        </div>

        <div className="profile-right">
          <div className="rating-card">
            <span className="rating-title">Rating</span>
            <span className="rating-value">1540</span>
          </div>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-box">
          <h3>Problems Solved</h3>
          <p>312</p>
        </div>
        <div className="stat-box">
          <h3>Easy</h3>
          <p>180</p>
        </div>
        <div className="stat-box">
          <h3>Medium</h3>
          <p>102</p>
        </div>
        <div className="stat-box">
          <h3>Hard</h3>
          <p>30</p>
        </div>
      </div>

      <div className="profile-sections">
        <div className="profile-card">
          <h2>About</h2>
          <p>
            Passionate competitive programmer focused on data structures,
            algorithms, and problem solving.
          </p>
        </div>

        <div className="profile-card">
          <h2>Recent Activity</h2>
          <ul className="activity-list">
            <li>Solved <strong>Two Sum</strong></li>
            <li>Solved <strong>Binary Search</strong></li>
            <li>Participated in Weekly Contest</li>
          </ul>
        </div>
      </div>
    </div>
    </>
  );
}
