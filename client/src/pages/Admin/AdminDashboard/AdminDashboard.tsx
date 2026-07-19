import { useEffect, useState } from "react";
import { FiUsers, FiCode, FiAward, FiActivity, FiMessageSquare, FiCheckCircle } from "react-icons/fi";
import { adminService } from "../../../services/admin.service";
import { AdminStats } from "../../../configs/admin.types";
import "./AdminDashboard.css";

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getStats();
        if (response.success) {
          setStats(response.stats);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ padding: "24px" }}>Loading dashboard...</div>;
  }

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers || 0,
      icon: <FiUsers />,
      color: "#3b82f6", // blue
      bg: "rgba(59, 130, 246, 0.1)"
    },
    {
      label: "Problems",
      value: stats?.totalProblems || 0,
      icon: <FiCode />,
      color: "#10b981", // green
      bg: "rgba(16, 185, 129, 0.1)"
    },
    {
      label: "Contests",
      value: stats?.totalContests || 0,
      icon: <FiAward />,
      color: "#8b5cf6", // purple
      bg: "rgba(139, 92, 246, 0.1)"
    },
    {
      label: "Submissions",
      value: stats?.totalSubmissions || 0,
      icon: <FiActivity />,
      color: "#f59e0b", // yellow
      bg: "rgba(245, 158, 11, 0.1)"
    },
    {
      label: "Accepted Submissions",
      value: stats?.acceptedSubmissions || 0,
      icon: <FiCheckCircle />,
      color: "#06b6d4", // cyan
      bg: "rgba(6, 182, 212, 0.1)"
    },
    {
      label: "Discussions",
      value: stats?.totalDiscussions || 0,
      icon: <FiMessageSquare />,
      color: "#ec4899", // pink
      bg: "rgba(236, 72, 153, 0.1)"
    }
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-stats-grid">
        {statCards.map((card, index) => (
          <div key={index} className="admin-stat-card">
            <div
              className="admin-stat-icon-wrapper"
              style={{ color: card.color, backgroundColor: card.bg }}
            >
              {card.icon}
            </div>
            <div className="admin-stat-info">
              <span className="admin-stat-value">{card.value.toLocaleString()}</span>
              <span className="admin-stat-label">{card.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
