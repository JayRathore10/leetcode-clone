import { useParams } from "react-router-dom";
import "../styles/Analyze.css";
import { Header } from "./Header";
import { LoginProps } from "./Login";
import { useEffect, useState } from "react";
import { Submission as SubmissionType } from "./Profile";
import axios from "axios";
import { env } from "../configs/env.config";

export function Analyze({ isloggedIn }: LoginProps) {
  const { id } = useParams<{ id: string }>();

  const [analyze, setAnalyze] = useState<string>("");
  const [submission, setSubmission] = useState<SubmissionType | null>(null);

  useEffect(() => {
    const fetchSubmissionDetail = async () => {
      try {
        const response = await axios.get(`${env.backendUrl}/api/submission/${id}`);
        setSubmission(response.data.submission);
      } catch (error) {
        console.log(error);
      }
    }
    fetchSubmissionDetail();
  }, [id]);

  const code = submission?.code;
  const problem = submission?.questionId.description;
  const language = submission?.language;

  useEffect(() => {

    if (!code || !problem || !language) return;

    const fetchAnalysisOutput = async () => {
      try {
        const response = await axios.post(`${env.backendUrl}/api/analyze`, {
          code,
          problem,
          language
        });

        setAnalyze(response.data.analysis);

      } catch (error) {
        console.log(error);
      }
    }
    fetchAnalysisOutput();
  }, [code, language, problem]);

  return (
    <>
      <Header isloggedIn={isloggedIn} />

      <div className="analyze-container">
        <h2 className="analyze-title">AI Code Analysis</h2>

        {!analyze && (
          <div className="analyze-loading">
            🤖 Analyzing your code...
          </div>
        )}

        {analyze && (
          <pre className="analyze-output">
            {analyze}
          </pre>
        )}
      </div>
    </>
  );

}