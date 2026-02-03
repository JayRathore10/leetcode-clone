import { useParams } from "react-router-dom";
import "../styles/Submission.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { env } from "../configs/env.config";
import { Submission as SubmissionType } from "./Profile";
import { LoginProps } from "./Login";
import { Header } from "./Header";

export function Submission({ isloggedIn }: LoginProps) {
  const { id } = useParams<{ id: string }>();
  const [submission, setSubmission] = useState<SubmissionType | null>(null);

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
          <h1 className="sd-title">{submission.title}</h1>

          <div className="sd-badges">
            <span
              className={`sd-badge difficulty ${submission.questionId.difficulty.toLowerCase()}`}
            >
              {submission.questionId.difficulty}
            </span>

            <span
              className={`sd-badge status ${submission.status === "Accepted" ? "accepted" : "wrong"
                }`}
            >
              {submission.status}
            </span>
          </div>
        </div>

        <div className="sd-code-container">
          <pre className="sd-code">
            <code>{submission.code}</code>
          </pre>
        </div>
      </div>
    </>
  );
}
