import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { contestService } from "../../services/contest.service";
import { Contest, ContestProblem } from "../../configs/contest.types";
import { LoadingScreen } from "../../components/LoadingScreen/LoadingScreen";
import { ContestTimer } from "../../components/ContestTimer/ContestTimer";
import { ContestProblemList } from "../../components/ContestProblemList/ContestProblemList";
import { FiClock, FiUsers, FiCalendar, FiArrowRight } from "react-icons/fi";
import "./ContestDetail.css";

export function ContestDetail() {
  const { contestId } = useParams<{ contestId: string }>();
  const navigate = useNavigate();
  
  const [contest, setContest] = useState<Contest | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // We don't have a specific endpoint for user's contest solved problems, 
  // so we'll leave it empty. Ideally, backend provides this.
  const solvedProblemIds: string[] = [];

  const fetchContestData = async () => {
    try {
      if (!contestId) return;
      const [contestRes, registeredRes] = await Promise.all([
        contestService.getContestById(contestId),
        contestService.getMyRegisteredContests().catch(() => ({ contests: [] })),
      ]);

      setContest(contestRes.contest);
      
      if (registeredRes.contests) {
        const registered = registeredRes.contests.some(
          (c: Contest) => c._id === contestId
        );
        setIsRegistered(registered);
      }
    } catch (err) {
      setError("Failed to load contest details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContestData();
  }, [contestId]);

  const handleRegisterToggle = async () => {
    if (!contestId) return;
    try {
      setActionLoading(true);
      if (isRegistered) {
        await contestService.unregisterFromContest(contestId);
      } else {
        await contestService.registerForContest(contestId);
      }
      setIsRegistered(!isRegistered);
      // Refresh contest to update participant count
      const res = await contestService.getContestById(contestId);
      setContest(res.contest);
    } catch (err: any) {
      alert(err.response?.data?.message || "Action failed.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;
  if (error || !contest) return <div className="error-message">{error || "Not Found"}</div>;

  const isUpcoming = contest.status === "Upcoming";
  const isRunning = contest.status === "Running";
  const isEnded = contest.status === "Ended";

  return (
    <>
      <Header isloggedIn={true} />
      <div className="contest-detail-page">
        <div className="contest-detail-header">
          <div className="cd-title-row">
            <h1>{contest.title}</h1>
            <span className={`cd-badge status-${contest.status.toLowerCase()}`}>
              {contest.status}
            </span>
          </div>
          
          <p className="cd-desc">{contest.description}</p>
          
          <div className="cd-meta-row">
            <div className="cd-meta">
              <FiCalendar />
              <span>{new Date(contest.startTime).toLocaleString()}</span>
            </div>
            <div className="cd-meta">
              <FiClock />
              <span>{contest.duration} Minutes</span>
            </div>
            <div className="cd-meta">
              <FiUsers />
              <span>{contest.participants.length} Participants</span>
            </div>
          </div>
        </div>

        <div className="contest-detail-content">
          <div className="cd-main">
            {isUpcoming && (
              <div className="cd-timer-section">
                <ContestTimer 
                  targetDate={contest.startTime} 
                  label="Contest starts in"
                  onExpire={() => {
                    // Refetch when timer expires to switch to 'Running'
                    fetchContestData();
                  }}
                />
              </div>
            )}
            
            {isRunning && (
              <div className="cd-timer-section running-timer">
                <ContestTimer 
                  targetDate={contest.endTime} 
                  label="Contest ends in"
                  onExpire={() => {
                    fetchContestData();
                  }}
                />
              </div>
            )}

            {(isRunning || isEnded) ? (
              <div className="cd-problems-section">
                <h2>Problems</h2>
                <ContestProblemList 
                  problems={contest.problems as ContestProblem[]}
                  contestId={contest._id}
                  solvedProblemIds={solvedProblemIds}
                />
              </div>
            ) : (
              <div className="cd-rules-section">
                <h2>Rules & Instructions</h2>
                <ul className="rules-list">
                  <li>Penalty for each wrong submission is 5 minutes.</li>
                  <li>Do not discuss problems during the contest.</li>
                  <li>Plagiarism will result in a permanent ban.</li>
                  <li>Have fun and learn!</li>
                </ul>
              </div>
            )}
          </div>

          <div className="cd-sidebar">
            <div className="cd-action-card">
              {isUpcoming ? (
                <>
                  <h3>Registration</h3>
                  <p>{isRegistered ? "You are registered!" : "Register to participate."}</p>
                  <button 
                    className={`cd-btn ${isRegistered ? "btn-danger" : "btn-primary"}`}
                    onClick={handleRegisterToggle}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Processing..." : isRegistered ? "Cancel Registration" : "Register Now"}
                  </button>
                </>
              ) : isRunning ? (
                <>
                  <h3>Live Contest</h3>
                  <p>The contest is currently running.</p>
                  <button 
                    className="cd-btn btn-primary"
                    onClick={() => navigate(`/contest/${contest._id}/leaderboard`)}
                  >
                    View Leaderboard <FiArrowRight />
                  </button>
                </>
              ) : (
                <>
                  <h3>Contest Ended</h3>
                  <p>Thank you for participating.</p>
                  <button 
                    className="cd-btn btn-primary"
                    onClick={() => navigate(`/contest/${contest._id}/results`)}
                  >
                    Final Results <FiArrowRight />
                  </button>
                  <button 
                    className="cd-btn btn-secondary mt-3"
                    onClick={() => navigate(`/contest/${contest._id}/leaderboard`)}
                  >
                    View Leaderboard
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
