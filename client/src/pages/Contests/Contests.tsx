import { useEffect, useState } from "react";
import { Header } from "../../components/Header/Header";
import { ContestCard } from "../../components/ContestCard/ContestCard";
import { contestService } from "../../services/contest.service";
import { Contest } from "../../configs/contest.types";
import { LoadingScreen } from "../../components/LoadingScreen/LoadingScreen";
import "./Contests.css";

export function Contests() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [registeredContestIds, setRegisteredContestIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"upcoming" | "running" | "past">("upcoming");

  useEffect(() => {
    const fetchContests = async () => {
      try {
        setLoading(true);
        // We use Promise.all to fetch both lists concurrently
        const [allRes, registeredRes] = await Promise.all([
          contestService.getAllContests(),
          contestService.getMyRegisteredContests().catch(() => ({ contests: [] })),
        ]);
        
        setContests(allRes.contests);
        
        if (registeredRes.contests) {
          const ids = registeredRes.contests.map((c: Contest) => c._id);
          setRegisteredContestIds(ids);
        }
      } catch (err) {
        setError("Failed to load contests.");
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  if (loading) return <LoadingScreen />;

  const upcomingContests = contests.filter((c) => c.status === "Upcoming");
  const runningContests = contests.filter((c) => c.status === "Running");
  const pastContests = contests.filter((c) => c.status === "Ended");

  const getActiveContests = () => {
    if (activeTab === "upcoming") return upcomingContests;
    if (activeTab === "running") return runningContests;
    return pastContests;
  };

  return (
    <>
      <Header isloggedIn={true} />
      <div className="contests-page-container">
        <div className="contests-header-section">
          <h1>Contests</h1>
          <p>Compete, build your ranking, and challenge your peers.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="contests-tabs">
          <button
            className={`tab-btn ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming ({upcomingContests.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "running" ? "active" : ""}`}
            onClick={() => setActiveTab("running")}
          >
            Running ({runningContests.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "past" ? "active" : ""}`}
            onClick={() => setActiveTab("past")}
          >
            Past ({pastContests.length})
          </button>
        </div>

        <div className="contests-list-grid">
          {getActiveContests().length > 0 ? (
            getActiveContests().map((contest) => (
              <ContestCard
                key={contest._id}
                contest={contest}
                isRegistered={registeredContestIds.includes(contest._id)}
              />
            ))
          ) : (
            <div className="no-contests">
              No {activeTab} contests found.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
