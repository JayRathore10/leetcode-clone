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

type Submission = {
  _id: string;
  status: "Accepted" | "WA" | "TLE" | "MLE";
  language: string;
  createdAt: string;
  questionId: string,
  title: string,
};


export function Profile() {

  const [username, setUserName] = useState<string>("");
  const [user, setUser] = useState<User>();
  const [submissions, setSubmissions] = useState<Submission[]>([]);

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

  useEffect(() => {
    const userSubmissions = async () => {
      try {
        const response = await axios.get(`${env.backendUrl}/api/submission/`);
        console.log(response.data);
        setSubmissions(response.data.submissions);
      } catch (error) {
        console.log(error);
      }
    }

    userSubmissions();
  }, []);

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
          <div className="profile-card submissions-card">
            <h2>Recent Submissions</h2>

            <table className="submission-table">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Status</th>
                  <th>Language</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center" }}>
                      No submissions yet
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub) => (
                    <tr key={sub._id}>
                      <td>{sub.title}</td>
                      <td className={`status ${sub.status.toLowerCase()}`}>
                        {sub.status}
                      </td>
                      <td>{sub.language}</td>
                      <td>
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </>
  );
}
