import { useEffect, useState } from "react";
import "./Problems.css";
import { Header } from "../../components/Header/Header";
import { env } from "../../configs/env.config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginProps } from "../Login/Login";
import { motion } from "framer-motion";
import { FiSearch, FiFilter } from "react-icons/fi";

type Question = {
  _id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  successRate: number;
  tags: string[];
};

const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export function Problems({ isloggedIn }: LoginProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [search,    setSearch]    = useState("");
  const [diff,      setDiff]      = useState("All");
  const [tag,       setTag]       = useState("All");
  const [loading,   setLoading]   = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${env.backendUrl}/api/question/all`)
      .then(r => {
        setQuestions(r.data.questions.map((q: Question) => ({
          ...q,
          successRate:
            q.difficulty === "Easy"   ? rnd(65, 90) :
            q.difficulty === "Medium" ? rnd(40, 65) : rnd(15, 40),
        })));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = questions.filter(q => {
    const matchSearch = q.title.toLowerCase().includes(search.toLowerCase());
    const matchDiff   = diff === "All" || q.difficulty === diff;
    const matchTag    = tag  === "All" || q.tags.some(t => t.toLowerCase() === tag.toLowerCase());
    return matchSearch && matchDiff && matchTag;
  });

  const diffColor = (d: string) =>
    d === "Easy" ? "prob-badge prob-badge--easy" :
    d === "Medium" ? "prob-badge prob-badge--med" :
    "prob-badge prob-badge--hard";

  return (
    <>
      <Header isloggedIn={isloggedIn!} />
      <main className="prob-page">
        {/* Page header */}
        <div className="prob-header">
          <div>
            <h1 className="prob-title">Problems</h1>
            <p className="prob-subtitle">{questions.length} problems available</p>
          </div>
        </div>

        {/* Filters */}
        <div className="prob-filters">
          <div className="prob-search-wrap">
            <FiSearch size={16} className="prob-search-icon" />
            <input
              className="prob-search"
              type="text"
              placeholder="Search problems…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="prob-selects">
            <div className="prob-select-wrap">
              <FiFilter size={14} />
              <select className="prob-select" value={diff} onChange={e => setDiff(e.target.value)}>
                <option value="All">All difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="prob-select-wrap">
              <FiFilter size={14} />
              <select className="prob-select" value={tag} onChange={e => setTag(e.target.value)}>
                <option value="All">All topics</option>
                <option value="Array">Array</option>
                <option value="String">String</option>
                <option value="Math">Math</option>
                <option value="Graph">Graph</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="prob-table">
          <div className="prob-table-head">
            <span>#</span>
            <span>Problem</span>
            <span>Difficulty</span>
            <span>Acceptance</span>
          </div>

          {loading ? (
            <div className="prob-empty">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="prob-skeleton" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="prob-empty-state">
              <FiSearch size={32} />
              <p>No problems match your filters.</p>
              <button className="prob-reset" onClick={() => { setSearch(""); setDiff("All"); setTag("All"); }}>
                Clear filters
              </button>
            </div>
          ) : (
            filtered.map((q, i) => {
              const orig = questions.findIndex(x => x._id === q._id);
              return (
                <motion.div
                  key={q._id}
                  className="prob-row"
                  onClick={() => navigate(`/problems/${q._id}`, { state: { successRate: q.successRate, questionNumber: orig + 1 } })}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.02 }}
                  whileHover={{ backgroundColor: "var(--bg-subtle)" }}
                >
                  <span className="prob-num">{orig + 1}</span>
                  <span className="prob-name">{q.title}</span>
                  <span><span className={diffColor(q.difficulty)}>{q.difficulty}</span></span>
                  <span className="prob-rate">{q.successRate}%</span>
                </motion.div>
              );
            })
          )}
        </div>
      </main>
    </>
  );
}
