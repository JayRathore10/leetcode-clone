import "../styles/Home.css";
import { Header } from "./Header";
import { useNavigate } from "react-router-dom";
import { LoginProps } from "./Login";
import { useEffect, useState } from "react";
import axios from "axios";
import { env } from "../configs/env.config";
import { motion } from "framer-motion";
import { MdOutlineFindInPage, MdTrendingUp } from "react-icons/md";
import { FaCode } from "react-icons/fa";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const stepIcons = [
  <MdOutlineFindInPage />,
  <FaCode />,
  <MdTrendingUp />
];


export function Home({ isloggedIn }: LoginProps) {
  const navigate = useNavigate();
  const [totalQuestions, setTotalQuestions] = useState<number>(0);

  useEffect(() => {
    const fetchQuestionLen = async () => {
      try {
        const response = await axios.get(`${env.backendUrl}/api/question/total`);
        setTotalQuestions(response.data.totalQuestion);
      } catch (error) {
        console.log(error);
      }
    };
    fetchQuestionLen();
  }, []);

  return (
    <>
      <Header isloggedIn={isloggedIn!} />

      <div className="home">
        <motion.section
          className="hero"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.5 }}
        >
          <h1 className="hero-title">Become a Better Programmer</h1>
          <p className="hero-subtitle">
            Practice coding problems, prepare for interviews, and compete with developers worldwide.
          </p>

          <div className="hero-actions">
            <button className="primary-btn" onClick={() => navigate("/problems")}>
              Start Solving
            </button>
            <button className="secondary-btn" onClick={() => navigate("/problems")}>
              Explore Problems
            </button>
          </div>
        </motion.section>

        <motion.section
          className="stats"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.15 }}
        >
          {[`${totalQuestions}+ Problems`, "20+ Topics", "Weekly Contests", "Global Leaderboard"].map(
            (item, i) => (
              <motion.div key={i} className="stat-card" variants={fadeUp}>
                <h2>{item.split(" ")[0]}</h2>
                <p>{item.split(" ").slice(1).join(" ")}</p>
              </motion.div>
            )
          )}
        </motion.section>

        <motion.section
          className="features"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.15 }}
        >
          <motion.div className="feature-card" variants={fadeUp}>
            <h3>Structured Learning</h3>
            <p>Solve problems by topic and difficulty to build strong fundamentals.</p>
          </motion.div>

          <motion.div className="feature-card" variants={fadeUp}>
            <h3>Interview Preparation</h3>
            <p>Curated problems frequently asked by top tech companies.</p>
          </motion.div>

          <motion.div className="feature-card" variants={fadeUp}>
            <h3>Compete & Improve</h3>
            <p>Join contests, climb leaderboards, and track your growth.</p>
          </motion.div>
        </motion.section>

        <motion.section
          className="how-it-works"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ staggerChildren: 0.2 }}
        >
          <motion.h2 variants={fadeUp}>How It Works</motion.h2>

          <div className="steps">
            {["Choose a problem", "Write & submit code", "Analyze & improve"].map(
              (step, i) => (
                <motion.div
                  key={i}
                  className="step-card"
                  variants={fadeUp}
                >
                  <motion.div
                    className="icon"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.2 }}
                  >
                    {stepIcons[i]}
                  </motion.div>

                  <p>{step}</p>
                </motion.div>
              )
            )}
          </div>

        </motion.section>

        <motion.section
          className="cta"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2>Ready to level up your coding skills?</h2>
          <button className="primary-btn" onClick={() => navigate("/problems")}>
            Start Practicing Now
          </button>
        </motion.section>
      </div>
    </>
  );
}
