import { useEffect, useState } from "react";
import { CodeEditor } from "../components/CodeEditor";
import "../styles/ProblemDetail.css";
import { Header } from "./Header";
import { useParams , useLocation } from "react-router-dom";
import axios from "axios";
import { env } from "../configs/env.config";
import { TestCasePanel } from "./TestCasePanel";

type Question =  {
  title : string, 
  description : string , 
  difficulty  : "Easy" | "Medium" | "Hard" , 
  tags : string[] , 
  constraints : string[] , 
  example: {
    input: string;
    output: string;
    explanation: string;
  };
}
export function ProblemDetail() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");

  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question>();

  const location = useLocation();
  const successRate = location.state?.successRate ;
  const questionNumber = location.state?.questionNumber;

  useEffect(() => {
    const fetchQuestion = async () => {

      try{
        const response = await axios.get(`${env.backendUrl}/api/question/${id}`);
        console.log(response.data);
        setQuestion(response.data.question);
      }catch(error){
        console.log(error);
      }
    }
    fetchQuestion();
  }, [id]);

  return (
    <>
      <Header />

      <div className="pd-problem-detail">
        <div className="pd-problem-left">
          <h1 className="pd-problem-title-number">{questionNumber}. </h1>
          <h1 className="pd-problem-title">{question?.title}</h1>

          <div className="pd-problem-meta">
            <span className={`difficulty ${question?.difficulty.toLowerCase()}`}>{question?.difficulty}</span>
            <span className="acceptance">Acceptance: {successRate}%</span>
          </div>

          <div className="pd-problem-description">
            <p>
              {question?.description}
            </p>
          </div>

          <div className="pd-problem-example">
            <h3>Example</h3>
            <pre>
              Input: {question?.example.input} &nbsp;
              Output: {question?.example.output}
              <p>
                <br></br>
                Explanation: {question?.example.explanation}
              </p>
            </pre>
          </div>

          <div className="pd-problem-constraints">
            <h3>Constraints</h3>
            <ul>
             <li>{question?.constraints.map((con , index)=>(
              <li key={index}>
                {con}
              </li>
             ) )}</li>
            </ul>
          </div>
        </div>


        <div className="pd-problem-right">
          <div className="pd-editor-header">
            <select
              className="pd-language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="cpp">C++</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>

            <div className="pd-editor-actions">
              <button className="pd-secondary-btn">Run</button>
              <button className="pd-primary-btn">Submit</button>
            </div>
          </div>

          <div className="pd-editor-container">
            <CodeEditor
              code={code}
              setCode={setCode}
              language={language}
            />
          </div>
          <TestCasePanel questionId={id!} />
        </div>
      </div>
    </>
  );
}
