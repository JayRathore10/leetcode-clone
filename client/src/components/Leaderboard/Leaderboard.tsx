import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { env } from "../../configs/env.config";
import "./Leaderboard.css";
import { LoginProps } from "../../pages/Login/Login";
import { Header } from "../Header/Header";
import { motion } from "framer-motion";

interface LeaderboardUser {
  rank: number;
  username: string;
  profilePic?: string;
  problemsSolved: number;
}

export function Leaderboard({ isloggedIn }: LoginProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`${env.backendUrl}/api/leaderboard`);
        setLeaderboard(res.data.leaderboard);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-page">
      <Header isloggedIn={isloggedIn!} />
      <main className="leaderboard-content">
        <div className="leaderboard-card">
          <h1>Leaderboard</h1>
          {loading ? (
            <div className="leaderboard-skeleton">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="leaderboard-skeleton-row"
                  initial={{ opacity: 0.5, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                />
              ))}
            </div>
          ) : (
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>User</th>
                  <th>Solved</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((user, index) => (
                  <motion.tr
                    key={user.username}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    whileHover={{ backgroundColor: "var(--bg-subtle)" }}
                  >
                    <td>{user.rank ?? index + 1}</td>
                    <td>
                      <Link
                        to={`/profile/${user.username}`}
                        className="leaderboard-user-link"
                        style={{
                          backgroundImage: user.profilePic
                            ? `url(${user.profilePic})`
                            : undefined,
                        }}
                      >
                        {user.username}
                      </Link>
                    </td>
                    <td>{user.problemsSolved}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}