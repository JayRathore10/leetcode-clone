import { useEffect, useState } from "react";
import "./Profile.css";
import { Header } from "../../components/Header/Header";
import axios from "axios";
import { env } from "../../configs/env.config";
import { LoginProps } from "../Login/Login";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

type User = {
  username: string;
  email: string;
  name: string;
  profilePic: string
}

export type Submission = {
  _id: string;
  status: "Accepted" | "WA" | "TLE" | "MLE";
  language: string;
  createdAt: string;
  code: string;
  questionId: {
    _id: string,
    difficulty: string,
    description: string
  }
  title: string,
};

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function Profile({ isloggedIn }: LoginProps) {

  // const [username, setUserName] = useState<string>("");
  const [user, setUser] = useState<User>();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [easy, setEasy] = useState<number>(0);
  const [hard, setHard] = useState<number>(0);
  const [medium, setMedium] = useState<number>(0);
  const [totalSolved, setTotalSolved] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);
  const [, setIsLoading] = useState<boolean>(true);
  const [,setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch user profile
        const userResponse = await axios.get(
          `${env.backendUrl}/api/users/profile`,
          {
            withCredentials: true,
          }
        );

        setUser(userResponse.data.user);

        // Fetch submissions and total questions
        const [submissionsResponse, questionsResponse] = await Promise.all([
          axios.get(`${env.backendUrl}/api/submission/`, {
            withCredentials: true,
          }),
          axios.get(`${env.backendUrl}/api/question/total`),
        ]);

        const submissions: Submission[] = submissionsResponse.data.submissions;
        const totalQuestions = questionsResponse.data.totalQuestion;

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

        setRating(
          totalQuestions > 0
            ? Math.floor((solved / totalQuestions) * 100)
            : 0
        );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error(err);

        if (axios.isAxiosError(err)) {
          console.log(err.response?.status);
          console.log(err.response?.data);
        }

        setError("Failed to load profile data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header isloggedIn={isloggedIn!} />
      <div className="profile-page">
        <div className="profile-header">
          <div className="profile-left">
            <div className="avatar-wrapper">
              <img
                src={`${env.backendUrl}/images/${user?.profilePic}`}
                className="avatar"
                alt="JR"
              />
              <button
                className="edit-profile-btn"
                onClick={() => navigate("/profile/edit")}
              >
                Edit Profile
              </button>
            </div>
            <div className="profile-info">
              <h1>{user?.name}</h1>
              <p className="username">@{user?.username}</p>
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
            <p>{easy}</p>
          </div>
          <div className="stat-box">
            <h3>Medium</h3>
            <p>{medium}</p>
          </div>
          <div className="stat-box">
            <h3>Hard</h3>
            <p>{hard}</p>
          </div>
        </div>

        <motion.div className="profile-sections"
          initial="hidden"
          animate="visible"
          variants={fade}
          transition={{ duration: 0.5 }}
        >
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
                      <td className="submission-title"
                        onClick={() => navigate(`/submission/${sub._id}`)}
                      >
                        {sub.title}
                      </td>
                      <td className={`status ${sub.status.toLowerCase()}`}>
                        {sub.status === "WA" ?
                          `Wrong Answer` :
                          sub.status
                        }
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

        </motion.div>
      </div>
    </>
  );
}
