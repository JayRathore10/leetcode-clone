import { useEffect, useState } from "react";
import { CodeEditor } from "../../components/CodeEditor/CodeEditor";
import { Header } from "../../components/Header/Header";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { env } from "../../configs/env.config";
import { TestCasePanel } from "../../components/TestCasePanel/TestCasePanel";
import { runCode, testCaseFields } from "../../utils/runcode";
import { SubmitPanel } from "../../components/SubmitPanel/SubmitPanel";
import { LoginProps } from "../Login/Login";
import { MaintenanceAlert } from "../../components/MaintenanceAlert/MaintenanceAlert";
import { motion } from "framer-motion";
import { FiPlay, FiSend, FiChevronDown } from "react-icons/fi";

import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import "./ProblemDetail.css";

type Question = {
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  constraints: string[];
  example: {
    input: string;
    output: string;
    explanation: string;
  };
};

type PanelMode = "testcase" | "submit";

export function ProblemDetail({ isloggedIn }: LoginProps) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState<testCaseFields>({});
  const [isRunning, setIsRunning] = useState(false);
  const [panelMode, setPanelMode] =
    useState<PanelMode>("testcase");

  const [submitResult, setSubmitResult] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useState<any>(null);

  const [submissionId, setSubmissionId] = useState("");
  const [showMaintenance, setShowMaintenance] =
    useState(false);

  const [question, setQuestion] = useState<Question>();

  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const successRate = location.state?.successRate;
  const questionNumber = location.state?.questionNumber;

  useEffect(() => {
    if (!id) return;

    axios
      .get(`${env.backendUrl}/api/question/${id}`)
      .then((res) => {
        setQuestion(res.data.question);
      })
      .catch(console.error);
  }, [id]);

  const diffCls = `ws-badge ws-badge--${question?.difficulty?.toLowerCase() ?? ""
    }`;

  const submitHandler = async () => {
    if (!isloggedIn) {
      alert("Please log in first.");
      return;
    }

    setIsRunning(true);
    setPanelMode("testcase");

    try {
      const res = await axios.post(
        `${env.backendUrl}/api/question/submit`,
        {
          questionId: id,
          code,
          language,
        },
        {
          withCredentials: true,
        }
      );

      setPanelMode("submit");
      setSubmitResult(res.data);

      const submission = await axios.post(
        `${env.backendUrl}/api/submission/`,
        {
          questionId: id,
          code,
          language,
          status: res.data.status,
          title: question?.title,
        },
        {
          withCredentials: true,
        }
      );

      setSubmissionId(submission.data.submission._id);
    } catch (err: unknown) {
      if (
        axios.isAxiosError(err) &&
        err.response?.status === 500
      ) {
        setShowMaintenance(true);
      }
    } finally {
      setIsRunning(false);
    }
  };

  const runHandler = async () => {
    try {
      await runCode({
        setOutput,
        code,
        language,
        questionNumber: id!,
        setIsRunning,
        isloggedIn,
      });
    } catch (err: unknown) {
      if (
        axios.isAxiosError(err) &&
        err.response?.status === 500
      ) {
        setShowMaintenance(true);
      }
    }
  };

  return (
    <>
      <Header isloggedIn={isloggedIn!} />

      <motion.div
        className="ws-layout"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <PanelGroup direction="horizontal">

          <Panel
            defaultSize={45}
            minSize={25}
            className="ws-left"
          >
            <div className="ws-left-header">
              <div className="ws-problem-meta">
                <span className="ws-problem-num">
                  {questionNumber}.
                </span>

                <h1 className="ws-problem-title">
                  {question?.title}
                </h1>
              </div>

              <div className="ws-badges">
                <span className={diffCls}>
                  {question?.difficulty}
                </span>

                {question?.tags.map((tag) => (
                  <span
                    key={tag}
                    className="ws-tag"
                  >
                    {tag}
                  </span>
                ))}

                <span className="ws-acceptance">
                  ~{successRate}% acceptance
                </span>
              </div>
            </div>

            <div className="ws-left-body">
              <div className="ws-section">
                <p className="ws-description">
                  {question?.description}
                </p>
              </div>

              {question?.example && (
                <div className="ws-section">
                  <h3 className="ws-section-title">
                    Example
                  </h3>

                  <div className="ws-example">
                    <div className="ws-example-row">
                      <span className="ws-example-label">
                        Input:
                      </span>

                      <code className="ws-example-val">
                        {question.example.input}
                      </code>
                    </div>

                    <div className="ws-example-row">
                      <span className="ws-example-label">
                        Output:
                      </span>

                      <code className="ws-example-val">
                        {question.example.output}
                      </code>
                    </div>

                    {question.example.explanation && (
                      <div className="ws-example-row">
                        <span className="ws-example-label">
                          Explanation:
                        </span>

                        <span className="ws-example-explain">
                          {question.example.explanation}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {question?.constraints &&
                question.constraints.length > 0 && (
                  <div className="ws-section">
                    <h3 className="ws-section-title">
                      Constraints
                    </h3>

                    <ul className="ws-constraints">
                      {question.constraints.map((c, i) => (
                        <li key={i}>
                          <code>{c}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              <div className="ws-section">
                {panelMode === "testcase" ? (
                  <TestCasePanel
                    questionId={id!}
                    output={output}
                    isRunning={isRunning}
                  />
                ) : (
                  <SubmitPanel
                    result={submitResult}
                    submissionId={submissionId}
                    onClose={() =>
                      setPanelMode("testcase")
                    }
                  />
                )}
              </div>
            </div>
          </Panel>


          <PanelResizeHandle className="ws-resize-handle" />

          <Panel
            defaultSize={55}
            minSize={30}
            className="ws-right"
          >
            <div className="ws-editor-toolbar">
              <div className="ws-lang-select-wrap">
                <FiChevronDown
                  size={13}
                  className="ws-lang-chevron"
                />

                <select
                  className="ws-lang-select"
                  value={language}
                  onChange={(e) =>
                    setLanguage(e.target.value)
                  }
                >
                  <option value="cpp">C++</option>
                  <option value="javascript">
                    JavaScript
                  </option>
                  <option value="python">
                    Python
                  </option>
                  <option value="java">Java</option>
                </select>
              </div>

              <div className="ws-editor-actions">
                <button
                  className="ws-run-btn"
                  onClick={runHandler}
                  disabled={isRunning}
                >
                  <FiPlay size={14} />
                  {isRunning ? "Running..." : "Run"}
                </button>

                <button
                  className="ws-submit-btn"
                  onClick={submitHandler}
                  disabled={isRunning}
                >
                  <FiSend size={14} />
                  Submit
                </button>
              </div>
            </div>

            <div className="ws-editor-body">
              <CodeEditor
                code={code}
                setCode={setCode}
                language={language}
              />
            </div>
          </Panel>
        </PanelGroup>
      </motion.div>

      {showMaintenance && (
        <MaintenanceAlert
          message="Run & Submit APIs are under maintenance. They will be back in a few days."
          onClose={() =>
            setShowMaintenance(false)
          }
        />
      )}
    </>
  );
}