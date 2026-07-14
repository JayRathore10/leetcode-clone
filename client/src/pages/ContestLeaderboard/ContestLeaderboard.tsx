import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { contestService } from "../../services/contest.service";
import { LoadingScreen } from "../../components/LoadingScreen/LoadingScreen";
import { FiArrowLeft, FiAward } from "react-icons/fi";
import "./ContestLeaderboard.css";

interface LeaderboardEntry {
  username: string;
  profilePic?: string;
  score: number;
  penalty: number;
  problemsSolved: number;
}

export function ContestLeaderboard() {
  const { contestId } = useParams<{ contestId: string }>();
  const navigate = useNavigate();
  
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!contestId) return;
      try {
        setLoading(true);
        const res = await contestService.getContestLeaderboard(contestId);
        setLeaderboard(res.leaderboard || []);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("Leaderboard not yet available for this contest.");
        } else {
          setError("Failed to load leaderboard.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [contestId]);

  if (loading) return <LoadingScreen />;

  return (
    <>
      <Header isloggedIn={true} />
      <div className="contest-leaderboard-page">
        <div className="cl-header">
          <button className="cl-back-btn" onClick={() => navigate(`/contest/${contestId}`)}>
            <FiArrowLeft /> Back to Contest
          </button>
          <div className="cl-title-wrap">
            <FiAward className="cl-icon" />
            <h1>Contest Leaderboard</h1>
          </div>
        </div>

        {error ? (
          <div className="cl-error-card">
            <p>{error}</p>
          </div>
        ) : (
          <div className="cl-table-container">
            <table className="cl-table">
              <thead>
                <tr>
                  <th className="col-rank">Rank</th>
                  <th className="col-user">User</th>
                  <th className="col-score">Score</th>
                  <th className="col-penalty">Penalty</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.length > 0 ? (
                  leaderboard.map((entry, index) => (
                    <tr key={entry.username}>
                      <td className="col-rank">
                        <span className={`rank-badge rank-${index + 1}`}>{index + 1}</span>
                      </td>
                      <td className="col-user">
                        <div className="user-info">
                          {entry.profilePic ? (
                            <img src={entry.profilePic} alt="profile" className="user-avatar" />
                          ) : (
                            <div className="user-avatar-placeholder">
                              {entry.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="user-name">{entry.username}</span>
                        </div>
                      </td>
                      <td className="col-score">{entry.score}</td>
                      <td className="col-penalty">{entry.penalty}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="cl-empty">
                      No participants have solved any problems yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
