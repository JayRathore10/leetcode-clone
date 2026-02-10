import { useEffect, useState } from "react";
import { CodeEditor } from "../components/CodeEditor";
import { Header } from "./Header";
import { useParams , useLocation } from "react-router-dom";
import axios from "axios";
import { env } from "../configs/env.config";
import { TestCasePanel } from "./TestCasePanel";
import { runCode } from '../utils/runcode';
import { testCaseFields } from "../utils/runcode";
import { SubmitPanel } from "./SubmitPanel";
import { LoginProps } from "./Login";
import {motion} from "framer-motion";
import "../styles/ProblemDetail.css";

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

type panelModeType = "testcase" | "submit" ;

const fade = {
  hidden : {opacity : 0, y : 20} , 
  visible: {opacity : 1 , y : 0}
}

export function ProblemDetail({isloggedIn} : LoginProps) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [output , setOutput] = useState<testCaseFields>({});
  const [isRunning , setIsRunning] = useState<boolean>(false);
  const [panelMode , setPanelMode] = useState<panelModeType>("testcase");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [submitResult , setSubmitResult] = useState<any>(null);
  const [submissionId , setSubmissionId] = useState<string>("");

  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question>();

  const location = useLocation();
  const successRate = location.state?.successRate ;
  const questionNumber : string = location.state?.questionNumber;

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

  const submitCodeHandler = async()=>{

    if(isloggedIn === false){
      alert("Login First");
      return ;
    }

    setIsRunning(true);
    setPanelMode("testcase");

    try{
      const response = await axios.post(`${env.backendUrl}/api/question/submit`  , {
        questionId : id ,
        code , 
        language
      } ,  { withCredentials: true });

      setPanelMode("submit");
      setSubmitResult(response.data);

      const submissionResponse = await axios.post(`${env.backendUrl}/api/submission/`, {
        questionId : id , 
        code , 
        language , 
        status : response.data.status , 
        title : question?.title
      } ,   { withCredentials: true });

      console.log(submissionResponse.data);
      setSubmissionId(submissionResponse.data.submission._id);

    }catch(err){
      console.log(err);
    }finally{
      setIsRunning(false);
    }

  }

  return (
    <>
      <Header isloggedIn={isloggedIn!} />

      <motion.div className="pd-problem-detail"
        initial="hidden"
        animate="visible" 
        variants={fade}
        transition={{
          duration :1
        }}
      >
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
          {panelMode === "testcase" && (
            <TestCasePanel questionId={id!} output={output!} isRunning= {isRunning} />     
          )}

          {panelMode === "submit" && (
            <SubmitPanel 
              result={submitResult}
              submissionId={submissionId}
              onClose={()=> setPanelMode("testcase")}
            />
          )}

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
              <button className="pd-secondary-btn"
                onClick={()=> runCode({ setOutput , code , language , questionNumber : id! , setIsRunning , isloggedIn})}
              >Run</button>
              <button className="pd-primary-btn"
                onClick={submitCodeHandler}
                disabled= {isRunning}
              >Submit</button>
            </div>
          </div>

          <div className="pd-editor-container">
            <CodeEditor
              code={code}
              setCode={setCode}
              language={language}
            />
          </div>
        </div>
      </motion.div>
    </>
  );
}
