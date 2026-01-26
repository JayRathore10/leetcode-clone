import { useEffect, useState } from "react";
import "../styles/Problems.css";
import { Header } from "./Header";
import { env } from "../configs/env.config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type Question = {
  _id: string;
  title: string;
  difficulty: string;
  successRate: number
}

export function Problems() {

  const [questions, setQuestions] = useState<Question[]>([]);

  const random = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllQuestions = async () => {
      const response = await axios.get(`${env.backendUrl}/api/question/all`);
      console.log(response.data);
      setQuestions(
        response.data.questions.map((q: Question) => ({
          ...q,
          successRate:
            q.difficulty === "Easy"
              ? random(65, 90)
              : q.difficulty === "Medium"
                ? random(40, 65)
                : random(15, 40)
        }))
      );
    }
    fetchAllQuestions();
  }, []);

  return (
    <>
      <Header />
      <div className="problems-page">
        <h1 className="page-title">Problems</h1>

        <div className="problems-filters">
          <input
            type="text"
            placeholder="Search problems"
            className="search-input"
          />

          <select className="filter-select">
            <option>All Difficulties</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

          <select className="filter-select">
            <option>All Topics</option>
            <option>Arrays</option>
            <option>Strings</option>
            <option>Dynamic Programming</option>
            <option>Graphs</option>
          </select>
        </div>

        <div className="problems-table">
          <div className="table-header">
            <span>S.No</span>
            <span>Title</span>
            <span>Difficulty</span>
            <span>Acceptance</span>
          </div>

          {questions.length !== 0 &&
            questions.map((question, index) => (
              <div className="table-row" key={index}
                onClick={() => navigate(`/problems/${question._id}` , {
                  state : {
                    successRate : question.successRate ,
                    questionNumber : index + 1
                  } , 
                })}
              >
                <span className="status done">{index + 1}</span>
                <span className="problem-title">{question.title}</span>
                <span className={`difficulty ${question.difficulty.toLowerCase()}`}>{question.difficulty}</span>
                <span>{question.successRate}%</span>
              </div>
            ))
          }
        </div>
      </div>
    </>
  );
}
