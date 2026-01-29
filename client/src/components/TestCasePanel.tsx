import axios from "axios";
import { useEffect, useState } from "react";
import { env } from "../configs/env.config";
import { testCaseFields } from "../utils/runcode";
import "../styles/TestCasePanel.css";

interface TestCase {
  _id: string;
  input: string;
  output: string;
}

interface TestCasePanelProps {
  questionId: string;
  output : testCaseFields[]
}

export function TestCasePanel({ questionId , output }: TestCasePanelProps) {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestCases = async () => {
      try {
        const response = await axios.get(
          `${env.backendUrl}/api/testcase/visible/${questionId}`
        );

        setTestCases(response.data.testCases);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestCases();
  }, [questionId]);

  if (loading) {
    return <div className="tc-loading">Loading test cases...</div>;
  }

  if (testCases.length === 0) {
    return <div className="tc-empty">No test cases available</div>;
  }

  return (
    <div className="tc-panel">
      <div className="tc-header">Test Cases</div>

      {testCases.map((tc, index) => (
        <div key={tc._id} className="tc-case">
          <div className="tc-case-title">
            Example {index + 1}
          </div>

          <div className="tc-block">
            <h4>Input</h4>
            <pre>{tc.input}</pre>
          </div>

          <div className="tc-block">
            <h4>Expected Output</h4>
            <pre>{tc.output}</pre>
          </div>
        </div>
      ))}
    </div>
  );
}
