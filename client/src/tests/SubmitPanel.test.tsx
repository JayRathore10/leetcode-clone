import { render, screen, fireEvent } from "@testing-library/react";
import { SubmitPanel } from "../components/SubmitPanel";
import { BrowserRouter } from "react-router-dom";

// Mock useNavigate
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("SubmitPanel Component", () => {
  const baseProps = {
    onClose: jest.fn(),
    submissionId: "123",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders submission status", () => {
    render(
      <BrowserRouter>
        <SubmitPanel
          {...baseProps}
          result={{ status: "Accepted" }}
        />
      </BrowserRouter>
    );

    expect(screen.getByText("Submission Result")).toBeInTheDocument();
    expect(screen.getByText("Accepted")).toBeInTheDocument();
  });

  test("calls onClose when close button is clicked", () => {
    render(
      <BrowserRouter>
        <SubmitPanel
          {...baseProps}
          result={{ status: "Accepted" }}
        />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("✕"));
    expect(baseProps.onClose).toHaveBeenCalled();
  });

  test("renders failed test case details", () => {
    render(
      <BrowserRouter>
        <SubmitPanel
          {...baseProps}
          result={{
            status: "Wrong Answer",
            failedTest: 2,
            expected: "10",
            actual: "5",
          }}
        />
      </BrowserRouter>
    );

    expect(screen.getByText(/Failed Test Case:/)).toBeInTheDocument();
    expect(screen.getByText(/Expected Output/)).toBeInTheDocument();
    expect(screen.getByText(/Actual Output/)).toBeInTheDocument();
  });

  test("renders total test cases", () => {
    render(
      <BrowserRouter>
        <SubmitPanel
          {...baseProps}
          result={{
            status: "Accepted",
            totalTest: 10,
          }}
        />
      </BrowserRouter>
    );

    expect(screen.getByText(/Total Test Cases:/)).toBeInTheDocument();
  });

  test("renders message if present", () => {
    render(
      <BrowserRouter>
        <SubmitPanel
          {...baseProps}
          result={{
            status: "Error",
            message: "Compilation Error",
          }}
        />
      </BrowserRouter>
    );

    expect(screen.getByText("Compilation Error")).toBeInTheDocument();
  });

  test("Analyze button navigates correctly", () => {
    render(
      <BrowserRouter>
        <SubmitPanel
          {...baseProps}
          result={{ status: "Accepted" }}
        />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Analyze Code"));
    expect(mockNavigate).toHaveBeenCalledWith("/analysis/123");
  });

  test("Analyze button is disabled if no submissionId", () => {
    render(
      <BrowserRouter>
        <SubmitPanel
          onClose={jest.fn()}
          submissionId=""
          result={{ status: "Accepted" }}
        />
      </BrowserRouter>
    );

    expect(screen.getByText("Analyze Code")).toBeDisabled();
  });
});