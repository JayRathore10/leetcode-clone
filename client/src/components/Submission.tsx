import { useParams } from "react-router-dom";
import "../styles/Submission.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { env } from "../configs/env.config";
import { Submission as SubmissionType } from "./Profile";
import { LoginProps } from "./Login";
import { Header } from "./Header";
import { useNavigate } from "react-router-dom";

import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c"; 
import "prismjs/components/prism-cpp"; 


export function Submission({ isloggedIn }: LoginProps) {
  const { id } = useParams<{ id: string }>();
  const [submission, setSubmission] = useState<SubmissionType | null>(null);

  const codeRef = useRef<HTMLElement | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [submission]);

  useEffect(() => {
    const fetchSubmissionDetails = async () => {
      const response = await axios.get(
        `${env.backendUrl}/api/submission/${id}`
      );
      setSubmission(response.data.submission);
    };
    fetchSubmissionDetails();
  }, [id]);

  if (!submission) return null;

  return (
    <>
      <Header
        isloggedIn={isloggedIn}
      />
      <div className="sd-container">
        <div className="sd-header">
          <h1 className="sd-title"
            onClick={()=> navigate(`/problems/${submission.questionId._id}`) }
          >{submission.title}</h1>

          <div className="sd-badges">
            <span
              className={`sd-badge sub-difficulty ${submission.questionId.difficulty.toLowerCase()}`}
            >
              {submission.questionId.difficulty}
            </span>

            <span
              className={`sd-badge sd-status ${submission.status === "Accepted" ? "accepted" : "wrong"
                }`}
            >
              {submission.status === "WA" ?
                `Wrong Answer` :
                submission.status
              }
            </span>
          </div>
        </div>

        <div className="sd-code-container">
          <pre className="sd-code">
            <code
              ref={codeRef}
              className={`language-${submission?.language}`}
            >{submission.code}</code>
          </pre>
        </div>
      </div>
    </>
  );
}
