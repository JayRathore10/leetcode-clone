import { useState } from "react";
import { CodeEditor } from "../components/CodeEditor";
import "../styles/ProblemDetail.css";
import { Header } from "./Header";
import { useParams } from "react-router-dom";

export function ProblemDetail() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");

  const {id} = useParams<{id : string}>();
  const[question , setQuestion] = useState<[]>([]);

  return (
    <>
      <Header />

      <div className="pd-problem-detail">
        <div className="pd-problem-left">
          <h1 className="pd-problem-title-number">1. </h1>
          <h1 className="pd-problem-title">Two Sum</h1>

          <div className="pd-problem-meta">
            <span className="difficulty easy">Easy</span>
            <span className="acceptance">Acceptance: 49%</span>
          </div>

          <div className="pd-problem-description">
            <p>
              Given an array of integers <strong>nums</strong> and an integer
              <strong> target</strong>, return indices of the two numbers such
              that they add up to target.
            </p>

            <p>
              You may assume that each input would have exactly one solution,
              and you may not use the same element twice.
            </p>
          </div>

          <div className="pd-problem-example">
            <h3>Example</h3>
            <pre>
Input: nums = [2,7,11,15], target = 9
Output: 0 1
            </pre>
          </div>

          <div className="pd-problem-constraints">
            <h3>Constraints</h3>
            <ul>
              <li>2 ≤ nums.length ≤ 10⁴</li>
              <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
              <li>-10⁹ ≤ target ≤ 10⁹</li>
              <li>Only one valid answer exists</li>
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
        </div>
      </div>
    </>
  );
}
