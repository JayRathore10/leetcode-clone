import "../styles/SubmitPanel.css";

interface SubmitPanelProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: any;
  onClose: () => void;
}

export function SubmitPanel({ result, onClose }: SubmitPanelProps) {
  return (
    <div className="submit-panel">
      <div className="submit-header">
        <h3>Submission Result</h3>
        <button className="submit-close" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className={`submit-status ${result.status}`}>
        {result.status}
      </div>

      {result.failedTest && (
        <>
          <p className="failed-test-cases" >Failed Test Case: {result.failedTest}</p>
          <pre  className="submit-message">
            Expected Output : {result.expected}
            <br className="outputs-gap" ></br>
            Actual Output : {result.actual}
          </pre>
        </>
      )}

      {result.totalTest && (
        <p className="total-test-cases">Total Test Cases: {result.totalTest}</p>
      )}

      {result.message && (
        <pre className="submit-message">{result.message}</pre>
      )}
    </div>
  );
}
