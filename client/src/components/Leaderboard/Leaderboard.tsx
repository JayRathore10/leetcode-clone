import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { env } from "../../configs/env.config";
import "./Leaderboard.css";
import { LoginProps } from "../../pages/Login/Login";
import { Header } from "../Header/Header";

interface LeaderboardUser {
  rank: number;
  username: string;
  profilePic: string;
  problemsSolved: number;
}

export function Leaderboard({isloggedIn} : LoginProps) {
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
    <Header isloggedIn={isloggedIn} />

    <main className="leaderboard-content">
      <div className="leaderboard-card">
        <h1>Leaderboard</h1>

        {loading ? (
          <p>Loading...</p>
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
                <tr key={user.username}>
                  <td>{user.rank ?? index + 1}</td>
                  <td>
                    <Link
                      to={`/profile/${user.username}`}
                      className="leaderboard-user-link"
                    >
                      {user.username}
                    </Link>
                  </td>
                  <td>{user.problemsSolved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  </div>
);

}