import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { env } from "../../configs/env.config";
import { LoginProps } from "../Login/Login";
import { motion } from "framer-motion";
import { FiEdit2 } from "react-icons/fi";
import { Header } from "../../components/Header/Header";
import "./Profile.css";

type User = {
  username: string;
  email?: string;
  name: string;
  profilePic: string;
};

export type Submission = {
  _id: string;
  status: "Accepted" | "WA" | "TLE" | "MLE";
  language: string;
  createdAt: string;
  code: string;
  questionId: {
    _id: string;
    difficulty: string;
    description: string;
  };
  title: string;
};

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Profile({ isloggedIn }: LoginProps) {
  const { username: profileUsername } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [easy, setEasy] = useState<number>(0);
  const [hard, setHard] = useState<number>(0);
  const [medium, setMedium] = useState<number>(0);
  const [totalSolved, setTotalSolved] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch user profile
        let userResponse;
        if (profileUsername) {
          userResponse = await axios.get(
            `${env.backendUrl}/api/users/${profileUsername}`
          );
        } else {
          userResponse = await axios.get(
            `${env.backendUrl}/api/users/profile`,
            { withCredentials: true }
          );
        }
        setUser(userResponse.data.user);

        // Fetch submissions
        let submissionsResponse;
        if (profileUsername) {
          submissionsResponse = await axios.get(
            `${env.backendUrl}/api/users/${profileUsername}/all-submissions`
          );
        } else {
          submissionsResponse = await axios.get(
            `${env.backendUrl}/api/submission/`,
            { withCredentials: true }
          );
        }

        // Fetch total questions
        const questionsResponse = await axios.get(
          `${env.backendUrl}/api/question/total`
        );
        const totalQuestions = questionsResponse.data.totalQuestion;

        const submissions: Submission[] = submissionsResponse.data.submissions || submissionsResponse.data;
        const uniqueQuestions = new Set<string>();
        let easyCount = 0;
        let mediumCount = 0;
        let hardCount = 0;

        submissions.forEach((sub) => {
          if (!sub.questionId) return;
          const qId = sub.questionId._id;
          if (uniqueQuestions.has(qId)) return;
          uniqueQuestions.add(qId);
          switch (sub.questionId.difficulty) {
            case "Easy":
              easyCount++;
              break;
            case "Medium":
              mediumCount++;
              break;
            case "Hard":
              hardCount++;
              break;
          }
        });

        const solved = uniqueQuestions.size;
        setSubmissions(submissions);
        setEasy(easyCount);
        setMedium(mediumCount);
        setHard(hardCount);
        setTotalSolved(solved);
        setRating(totalQuestions > 0 ? Math.floor((solved / totalQuestions) * 100) : 0);
      } catch (err) {
        console.error(err);
        if (axios.isAxiosError(err)) {
          console.log(err.response?.status, err.response?.data);
        }
        setError("Failed to load profile data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [profileUsername]);

  if (isLoading) {
    return (
      <>
        <Header isloggedIn={isloggedIn!} />
        <div className="profile-page">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header isloggedIn={isloggedIn!} />
        <div className="profile-page">
          <div className="error-state">
            <p>{error}</p>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header isloggedIn={isloggedIn!} />
        <div className="profile-page">
          <div className="error-state">
            <p>User not found.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header isloggedIn={isloggedIn!} />
      <div className="profile-page">
        <div className="profile-header">
          <div className="profile-left">
            <div className="avatar-wrapper">
              <img
                src={`${env.backendUrl}/images/${user.profilePic}`}
                className="avatar"
                alt={`${user.name}'s profile`}
              />
              {!profileUsername && (
                <button
                  className="edit-profile-btn"
                  onClick={() => navigate("/profile/edit")}
                  aria-label="Edit Profile"
                >
                  <FiEdit2 />
                </button>
              )}
            </div>
            <div className="profile-info">
              <h1>{user.name}</h1>
              <p className="username">@{user.username}</p>
            </div>
          </div>
          <div className="profile-right">
            <div className="rating-card">
              <span className="rating-title">Rating</span>
              <span className="rating-value">{rating}</span>
            </div>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-box">
            <h3>Problems Solved</h3>
            <p>{totalSolved}</p>
          </div>
          <div className="stat-box">
            <h3>Easy</h3>
            <p style={{ color: "var(--easy-color)" }}>{easy}</p>
          </div>
          <div className="stat-box">
            <h3>Medium</h3>
            <p style={{ color: "var(--brand-500)" }}>{medium}</p>
          </div>
          <div className="stat-box">
            <h3>Hard</h3>
            <p style={{ color: "var(--hard-color)" }}>{hard}</p>
          </div>
        </div>

        <motion.div
          className="profile-sections"
          initial="hidden"
          animate="visible"
          variants={fade}
          transition={{ duration: 0.5 }}
        >
          <div className="profile-card submissions-card">
            <h2>Recent Submissions</h2>
            <div className="table-container">
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
                      <td colSpan={4} className="no-submissions">
                        No submissions yet
                      </td>
                    </tr>
                  ) : (
                    submissions.slice(0, 10).map((sub) => (
                      <tr key={sub._id}>
                        <td
                          className="submission-title"
                          onClick={() => navigate(`/submission/${sub._id}`)}
                        >
                          {sub.title}
                        </td>
                        <td className={`status ${sub.status.toLowerCase()}`}>
                          {sub.status === "WA" ? "Wrong Answer" : sub.status}
                        </td>
                        <td>{sub.language}</td>
                        <td>{new Date(sub.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}