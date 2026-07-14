import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { contestService } from "../../services/contest.service";
import { LoadingScreen } from "../../components/LoadingScreen/LoadingScreen";
import { FiArrowLeft, FiBarChart2 } from "react-icons/fi";
import "./ContestResults.css";

export function ContestResults() {
  const { contestId } = useParams<{ contestId: string }>();
  const navigate = useNavigate();
  
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!contestId) return;
      try {
        setLoading(true);
        const res = await contestService.getContestResults(contestId);
        setResults(res.results || null);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("Results not yet available for this contest.");
        } else {
          setError("Failed to load contest results.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [contestId]);

  if (loading) return <LoadingScreen />;

  return (
    <>
      <Header isloggedIn={true} />
      <div className="contest-results-page">
        <div className="cr-header">
          <button className="cr-back-btn" onClick={() => navigate(`/contest/${contestId}`)}>
            <FiArrowLeft /> Back to Contest
          </button>
          <div className="cr-title-wrap">
            <FiBarChart2 className="cr-icon" />
            <h1>Contest Results</h1>
          </div>
        </div>

        {error ? (
          <div className="cr-error-card">
            <p>{error}</p>
          </div>
        ) : (
          <div className="cr-content">
            <div className="cr-stats-grid">
              <div className="cr-stat-card">
                <h3>Total Participants</h3>
                <div className="stat-value">{results?.totalParticipants || 0}</div>
              </div>
              <div className="cr-stat-card">
                <h3>Average Score</h3>
                <div className="stat-value">{results?.averageScore || 0}</div>
              </div>
              <div className="cr-stat-card">
                <h3>Highest Score</h3>
                <div className="stat-value">{results?.highestScore || 0}</div>
              </div>
            </div>

            <div className="cr-cta-card">
              <h3>See Full Rankings</h3>
              <p>Check out the final leaderboard to see where everyone placed.</p>
              <button 
                className="cr-btn-primary" 
                onClick={() => navigate(`/contest/${contestId}/leaderboard`)}
              >
                View Final Leaderboard
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
