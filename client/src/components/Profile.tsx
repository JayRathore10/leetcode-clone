import { useEffect, useState } from "react";
import "../styles/Profile.css";
import { Header } from "./Header";
import axios from "axios";
import { env } from "../configs/env.config";

type User = {
  username: string;
  email: string;
  name: string
}

export function Profile() {

  const [username, setUserName] = useState<string>("");
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchUserData = async () => {
      /*
        we have to use /api/users/profile to get the user detail but we dont have user middleware connection so we use /api/users/:username to the info about the user  
      */
      setUserName("Jay_Rathore1");
      try {
        const response = await axios.get(`${env.backendUrl}/api/users/${username}`);
        setUser(response.data.user);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUserData();
  }, [username]);

  return (
    <>
      <Header />
      <div className="profile-page">
        <div className="profile-header">
          <div className="profile-left">
            <div className="avatar">JR</div>
            <div className="profile-info">
              <h1>{user?.name}</h1>
              <p className="username">@{user?.username}</p>
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
