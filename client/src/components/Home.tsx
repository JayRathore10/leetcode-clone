import "../styles/Home.css";
import { Header } from "./Header";
import {useNavigate } from "react-router-dom";
import { LoginProps } from "./Login";
import { useEffect, useState } from "react";
import axios from "axios";
import { env } from "../configs/env.config";

export function Home({isloggedIn} : LoginProps) {
  const navigate = useNavigate();

  const [totalQuestions , setTotalQuestions] = useState<number>(0);

  useEffect(()=>{
    const fetchQuestionLen = async()=>{
      try{  
        const response = await axios.get(`${env.backendUrl}/api/question/total`);
        setTotalQuestions(response.data.totalQuestion);
      }catch(error){
        console.log(error);
      }
    }
    fetchQuestionLen();
  } , []);

  return (
    <>
      <Header isloggedIn={isloggedIn!} />
      <div className="home">
        <section className="hero">
          <h1 className="hero-title">
            Become a Better Programmer
          </h1>
          <p className="hero-subtitle">
            Practice coding problems, prepare for interviews, and compete with developers worldwide.
          </p>

          <div className="hero-actions">
            <button className="primary-btn"
              onClick={()=> navigate("/problems") }
            >Start Solving</button>
            <button className="secondary-btn"
              onClick={()=> navigate("/problems")}
            >Explore Problems</button>
          </div>
        </section>

        <section className="stats">
          <div className="stat-card">
            <h2>{totalQuestions}+</h2>
            <p>Problems</p>
          </div>
          <div className="stat-card">
            <h2>20+</h2>
            <p>Topics</p>
          </div>
          <div className="stat-card">
            <h2>Weekly</h2>
            <p>Contests</p>
          </div>
          <div className="stat-card">
            <h2>Global</h2>
            <p>Leaderboard</p>
          </div>
        </section>

        <section className="features">
          <div className="feature-card">
            <h3>Structured Learning</h3>
            <p>
              Solve problems by topic and difficulty to build strong fundamentals.
            </p>
          </div>

          <div className="feature-card">
            <h3>Interview Preparation</h3>
            <p>
              Curated problems asked by top tech companies.
            </p>
          </div>

          <div className="feature-card">
            <h3>Compete & Improve</h3>
            <p>
              Join contests and track your progress on the leaderboard.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
