import { useNavigate } from "react-router-dom";
import { ContestProblem } from "../../configs/contest.types";
import { FiCheckCircle } from "react-icons/fi";
import "./ContestProblemList.css";

interface ContestProblemListProps {
  problems: ContestProblem[];
  contestId: string;
  solvedProblemIds?: string[];
}

export function ContestProblemList({
  problems,
  contestId,
  solvedProblemIds = [],
}: ContestProblemListProps) {
  const navigate = useNavigate();

  return (
    <div className="contest-problem-list">
      <div className="problem-list-header">
        <div className="col-status">Status</div>
        <div className="col-title">Title</div>
        <div className="col-difficulty">Difficulty</div>
      </div>

      <div className="problem-list-body">
        {problems.map((problem) => {
          const isSolved = solvedProblemIds.includes(problem._id);
          
          return (
            <div
              key={problem._id}
              className="problem-row"
              onClick={() => navigate(`/contest/${contestId}/problem/${problem._id}`)}
            >
              <div className="col-status">
                {isSolved ? (
                  <FiCheckCircle className="status-icon solved" />
                ) : (
                  <span className="status-dash">-</span>
                )}
              </div>
              
              <div className="col-title">
                <span className="problem-title-text">{problem.title}</span>
              </div>
              
              <div className="col-difficulty">
                <span className={`diff-badge diff-${problem.difficulty.toLowerCase()}`}>
                  {problem.difficulty}
                </span>
              </div>
            </div>
          );
        })}
        
        {problems.length === 0 && (
          <div className="no-problems">
            No problems have been added to this contest yet.
          </div>
        )}
      </div>
    </div>
  );
}
