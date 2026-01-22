import "../styles/Problems.css";
import { Header } from "./Header";

export function Problems() {
  return (
    <>
    <Header />
    <div className="problems-page">
      <h1 className="page-title">Problems</h1>

      <div className="problems-filters">
        <input
          type="text"
          placeholder="Search problems"
          className="search-input"
          />

        <select className="filter-select">
          <option>All Difficulties</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <select className="filter-select">
          <option>All Topics</option>
          <option>Arrays</option>
          <option>Strings</option>
          <option>Dynamic Programming</option>
          <option>Graphs</option>
        </select>
      </div>

      <div className="problems-table">
        <div className="table-header">
          <span>Status</span>
          <span>Title</span>
          <span>Difficulty</span>
          <span>Acceptance</span>
        </div>

        <div className="table-row">
          <span className="status done">✔</span>
          <span className="problem-title">Two Sum</span>
          <span className="difficulty easy">Easy</span>
          <span>49%</span>
        </div>

        <div className="table-row">
          <span className="status">•</span>
          <span className="problem-title">Longest Substring Without Repeating Characters</span>
          <span className="difficulty medium">Medium</span>
          <span>34%</span>
        </div>

        <div className="table-row">
          <span className="status">•</span>
          <span className="problem-title">Merge K Sorted Lists</span>
          <span className="difficulty hard">Hard</span>
          <span>29%</span>
        </div>
      </div>
    </div>
  </>
  );
}
