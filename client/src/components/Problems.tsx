import { useEffect, useState } from "react";
import "../styles/Problems.css";
import { Header } from "./Header";
import { env } from "../configs/env.config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginProps } from "./Login";

type Question = {
  _id: string;
  title: string;
  difficulty: string;
  successRate: number;
  tags : [string]
}

export function Problems({ isloggedIn }: LoginProps) {

  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchItem, setSearchItem] = useState<string>("");
  const [selectDiff, setSelectDiff] = useState<string>("All Difficulties");
  const [selectTags , setSelectTags] = useState<string>("All Topics");

  const random = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllQuestions = async () => {
      try {
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
      } catch (error) {
        console.log(error)
      }
    }
    fetchAllQuestions();
  }, []);

  const filterQuestions = questions.filter((question) => {
    const matchedSearch = question.title.toLowerCase().includes(searchItem.toLowerCase());
    const matchedDiff = selectDiff === "All Difficulties" || question.difficulty === selectDiff ;
    const matchedTags = selectTags === "All Topics" || question.tags.some((t)=>(
      t.toLowerCase() === selectTags.toLowerCase()
    ));

    return matchedDiff && matchedSearch && matchedTags;  
  });

  return (
    <>
      <Header isloggedIn={isloggedIn!} />
      <div className="problems-page">
        <h1 className="page-title">Problems</h1>

        <div className="problems-filters">
          <input
            type="text"
            placeholder="Search problems"
            className="search-input"
            onChange={(e) => setSearchItem(e.target.value)}
          />

          <select className="filter-select"
            onChange={(e)=> setSelectDiff(e.target.value)}
          >
            <option>All Difficulties</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

          <select className="filter-select"
            onChange={(e)=> setSelectTags(e.target.value)}
          >
            <option>All Topics</option>
            <option>Array</option>
            <option>String</option>
            <option>Math</option>
            <option>Graph</option>
          </select>
        </div>

        <div className="problems-table">
          <div className="table-header">
            <span>S.No</span>
            <span>Title</span>
            <span>Difficulty</span>
            <span>Acceptance</span>
          </div>

          {filterQuestions.length !== 0 &&
            filterQuestions.map((question, index) => {

              const originalIndex = questions.findIndex((q) => q._id === question._id);

              return (
                <div className="table-row" key={index}
                  onClick={() => navigate(`/problems/${question._id}`, {
                    state: {
                      successRate: question.successRate,
                      questionNumber: originalIndex + 1
                    },
                  })}
                >
                  <span className="status done">{originalIndex + 1}</span>
                  <span className="problem-title">{question.title}</span>
                  <span className={`difficulty ${question.difficulty.toLowerCase()}`}>{question.difficulty}</span>
                  <span>{question.successRate}%</span>
                </div>
              )
            })
          }
        </div>
      </div>
    </>
  );
}
