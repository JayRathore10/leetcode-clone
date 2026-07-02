import "./Home.css";
import { Header } from "../../components/Header/Header";
import { useNavigate } from "react-router-dom";
import { LoginProps } from "../Login/Login";
import { useEffect, useState } from "react";
import axios from "axios";
import { env } from "../../configs/env.config";
import { motion } from "framer-motion";
import { Variants } from "framer-motion";
import { Footer } from "../../components/Footer/Footer";
import {
  FiArrowRight, FiZap, FiTarget, FiTrendingUp,
  FiCode, FiUsers, FiAward
} from "react-icons/fi";


const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export function Home({ isloggedIn }: LoginProps) {
  const navigate = useNavigate();
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    axios.get(`${env.backendUrl}/api/question/total`)
      .then(r => setTotal(r.data.totalQuestion))
      .catch(() => {});
  }, []);

  const stats = [
    { icon: <FiCode size={22} />,      label: "Problems",          value: `${total}+` },
    { icon: <FiUsers size={22} />,     label: "Active Coders",     value: "500+" },
    { icon: <FiZap size={22} />,       label: "Topics Covered",    value: "20+" },
    { icon: <FiAward size={22} />,     label: "Weekly Contests",   value: "∞" },
  ];

  const features = [
    {
      icon: <FiTarget size={24} />,
      title: "Structured Learning",
      desc: "Curated problem sets organized by topic and difficulty. Build solid fundamentals systematically.",
    },
    {
      icon: <FiZap size={24} />,
      title: "Interview Ready",
      desc: "Practice the exact patterns that top companies test. Go from confused to confident.",
    },
    {
      icon: <FiTrendingUp size={24} />,
      title: "Track Growth",
      desc: "Detailed submission history, performance analytics, and a global leaderboard to fuel your progress.",
    },
  ];

  const steps = [
    { num: "01", title: "Pick a problem", desc: "Filter by topic, difficulty, or tag." },
    { num: "02", title: "Write your solution", desc: "Use our Monaco-powered editor in any language." },
    { num: "03", title: "Submit & analyze", desc: "Instant results + AI feedback on your approach." },
  ];

  return (
    <>
      <Header isloggedIn={isloggedIn!} />

      <main className="hm-page">
        {/* ── Hero ─────────────────────────────── */}
        <motion.section
          className="hm-hero"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.h1 className="hm-hero-title" variants={fadeUp}>
            Master Algorithms.<br />
            <span className="hm-hero-gradient">Land Your Dream Job.</span>
          </motion.h1>

          <motion.p className="hm-hero-sub" variants={fadeUp}>
            Practice hand-picked coding problems, get instant feedback, and compete
            with developers worldwide — all in one sleek platform.
          </motion.p>

          <motion.div className="hm-hero-actions" variants={fadeUp}>
            <button className="hm-btn-primary" onClick={() => navigate("/problems")}>
              Start solving <FiArrowRight size={16} />
            </button>
            <button className="hm-btn-secondary" onClick={() => navigate("/leaderboard")}>
              View leaderboard
            </button>
          </motion.div>
        </motion.section>

        {/* ── Stats ────────────────────────────── */}
        <motion.section
          className="hm-stats"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
        >
          {stats.map((s, i) => (
            <motion.div key={i} className="hm-stat-card" variants={fadeUp}>
              <div className="hm-stat-icon">{s.icon}</div>
              <div className="hm-stat-val">{s.value}</div>
              <div className="hm-stat-label">{s.label}</div>
            </motion.div>
          ))}
        </motion.section>

        {/* ── Features ─────────────────────────── */}
        <motion.section
          className="hm-features"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          <motion.div className="hm-section-header" variants={fadeUp}>
            <h2 className="hm-section-title">Everything you need to succeed</h2>
            <p className="hm-section-sub">
              From beginner warm-ups to hard interview problems, CodeChamp has you covered.
            </p>
          </motion.div>

          <div className="hm-feature-grid">
            {features.map((f, i) => (
              <motion.div key={i} className="hm-feature-card" variants={fadeUp}>
                <div className="hm-feature-icon">{f.icon}</div>
                <h3 className="hm-feature-title">{f.title}</h3>
                <p className="hm-feature-desc">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── How it works ─────────────────────── */}
        <motion.section
          className="hm-how"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          <motion.div className="hm-section-header" variants={fadeUp}>
            <h2 className="hm-section-title">How it works</h2>
            <p className="hm-section-sub">Get from zero to hired in three simple steps.</p>
          </motion.div>

          <div className="hm-steps">
            {steps.map((s, i) => (
              <motion.div key={i} className="hm-step" variants={fadeUp}>
                <div className="hm-step-num">{s.num}</div>
                <h3 className="hm-step-title">{s.title}</h3>
                <p className="hm-step-desc">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── CTA ──────────────────────────────── */}
        <motion.section
          className="hm-cta"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
        >
          <h2 className="hm-cta-title">Ready to level up?</h2>
          <p className="hm-cta-sub">
            Join hundreds of developers sharpening their skills on CodeChamp today.
          </p>
          <button className="hm-btn-primary hm-cta-btn" onClick={() => navigate("/problems")}>
            Start practicing — it's free <FiArrowRight size={16} />
          </button>
        </motion.section>
      </main>
      <Footer />
    </>
  );
}
