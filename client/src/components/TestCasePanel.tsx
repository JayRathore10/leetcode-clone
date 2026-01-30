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
  output: testCaseFields
}

export function TestCasePanel({ questionId, output }: TestCasePanelProps) {
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
      {testCases.map((tc, index) => {
        const testIndex = index + 1;

        const isIdle = !output;
        if(isIdle){/* pass eslint */}
        const isFailed = output?.failedTest === testIndex || output?.success === false;
        const isPassed = output?.success === true && !isFailed;

        let caseClass = "tc-case-idle";
        if (isPassed) caseClass = "tc-case-passed";
        if (isFailed) caseClass = "tc-case-failed";

        return (
          <div key={tc._id} className={`tc-case ${caseClass}`}>
            <div className={`tc-case-title ${caseClass}`}>
              Example {testIndex}
            </div>

            <div className="tc-block">
              <h4>Input</h4>
              <pre>{tc.input}</pre>
            </div>

            <div className="tc-block">
              <h4>Output</h4>
              <pre>{tc.output}</pre>
            </div>
          </div>
        );
      })}
    </div>
  );
}
