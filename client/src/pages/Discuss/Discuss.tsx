import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiPlus, FiMessageSquare, FiAlertCircle } from "react-icons/fi";

import { Header } from "../../components/Header/Header";
import {
  DiscussionCard,
  DiscussionCardSkeleton,
} from "../../components/DiscussionCard/DiscussionCard";
import { env } from "../../configs/env.config";
import {
  Discussion,
  DiscussionCategory,
  DiscussionListResponse,
  CATEGORIES,
  SearchResponse,
} from "../../configs/discussion.types";
import { LoginProps } from "../Login/Login";
import "./Discuss.css";

const ALL_CATEGORIES: (DiscussionCategory | "All")[] = ["All", ...CATEGORIES];

export function Discuss({ isloggedIn }: LoginProps) {
  const navigate = useNavigate();

  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<DiscussionCategory | "All">("All");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDiscussions, setTotalDiscussions] = useState(0);

  const LIMIT = 10;

  const fetchDiscussions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params: Record<string, string | number> = {
        page: currentPage,
        limit: LIMIT,
      };
      if (activeCategory !== "All") {
        params.category = activeCategory;
      }

      const res = await axios.get<DiscussionListResponse>(
        `${env.backendUrl}/api/discussion`,
        { params, withCredentials: true }
      );

      if (res.data.success) {
        setDiscussions(res.data.discussions);
        setTotalPages(res.data.totalPages);
        setTotalDiscussions(res.data.totalDiscussions);
      }
    } catch {
      setError("Failed to load discussions. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, activeCategory]);

  useEffect(() => {
    fetchDiscussions();
  }, [fetchDiscussions]);

  // Search with debounce
  useEffect(() => {
    if (!search.trim()) return;

    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get<SearchResponse>(
          `${env.backendUrl}/api/discussion/search`,
          { params: { q: search }, withCredentials: true }
        );
        if (res.data.success) {
          setDiscussions(res.data.discussions);
          setTotalPages(1);
          setTotalDiscussions(res.data.total);
        }
      } catch {
        setError("Search failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Reset to first page and re-fetch when search is cleared
  useEffect(() => {
    if (!search.trim()) {
      setCurrentPage(1);
      fetchDiscussions();
    }
  }, [search , fetchDiscussions]);

  const handleCategoryChange = (cat: DiscussionCategory | "All") => {
    setActiveCategory(cat);
    setCurrentPage(1);
    setSearch("");
  };

  const renderPageButtons = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages.map((p) => (
      <button
        key={p}
        className={`disc-page-btn${p === currentPage ? " active" : ""}`}
        onClick={() => setCurrentPage(p)}
      >
        {p}
      </button>
    ));
  };

  return (
    <>
      <Header isloggedIn={isloggedIn!} />
      <main className="disc-page">
        {/* Header */}
        <div className="disc-page-header">
          <div>
            <h1 className="disc-page-title">Discussions</h1>
            <p className="disc-page-subtitle">
              {totalDiscussions} discussion{totalDiscussions !== 1 ? "s" : ""} in
              the community
            </p>
          </div>
          <button
            className="disc-new-btn"
            onClick={() => navigate("/discuss/new")}
          >
            <FiPlus size={15} />
            New Discussion
          </button>
        </div>

        {/* Toolbar */}
        <div className="disc-toolbar">
          <div className="disc-search-wrap">
            <FiSearch size={16} className="disc-search-icon" />
            <input
              className="disc-search"
              type="text"
              placeholder="Search discussions…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="disc-categories">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`disc-cat-btn${activeCategory === cat ? " active" : ""}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sort row */}
        {!loading && !error && discussions.length > 0 && (
          <div className="disc-sort-row">
            <span className="disc-result-count">
              Showing {discussions.length} of {totalDiscussions}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="disc-list">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
              >
                {[...Array(5)].map((_, i) => (
                  <DiscussionCardSkeleton key={i} />
                ))}
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                className="disc-error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <FiAlertCircle size={36} />
                <p>{error}</p>
                <button className="disc-retry-btn" onClick={fetchDiscussions}>
                  Retry
                </button>
              </motion.div>
            ) : discussions.length === 0 ? (
              <motion.div
                key="empty"
                className="disc-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <FiMessageSquare size={40} />
                <p>
                  {search
                    ? "No discussions match your search"
                    : "No discussions yet"}
                </p>
                <span className="disc-empty-sub">
                  {search
                    ? "Try a different search term"
                    : "Be the first to start a conversation!"}
                </span>
                {search ? (
                  <button
                    className="disc-empty-action"
                    onClick={() => setSearch("")}
                  >
                    Clear search
                  </button>
                ) : (
                  <button
                    className="disc-empty-action"
                    onClick={() => navigate("/discuss/new")}
                  >
                    Create Discussion
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
              >
                {discussions.map((disc, i) => (
                  <DiscussionCard
                    key={disc._id}
                    discussion={disc}
                    index={i}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="disc-pagination">
            <button
              className="disc-page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </button>
            {renderPageButtons()}
            <button
              className="disc-page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </>
  );
}
