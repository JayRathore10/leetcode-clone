import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { TestCasePanel } from '../components/TestCasePanel/TestCasePanel';

jest.mock("../configs/env.config", () => ({
  env: {
    backendUrl: "http://localhost:5000",
  },
}));

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("TestCasePanel", () => {
  const mockTestCases = [
    { _id: "1", input: "1 2", output: "3" },
    { _id: "2", input: "2 3", output: "5" },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("shows loading initially", () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { testCases: [] },
    });

    render(
      <TestCasePanel
        questionId="q1"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        output={null as any}
        isRunning={false}
      />
    );

    expect(screen.getByText(/Loading test cases/i)).toBeInTheDocument();
  });

  test("renders test cases after fetch", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { testCases: mockTestCases },
    });

    render(
      <TestCasePanel
        questionId="q1"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        output={null as any}
        isRunning={false}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Example 1")).toBeInTheDocument();
      expect(screen.getByText("Example 2")).toBeInTheDocument();
    });

    expect(screen.getByText("1 2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  test("shows empty state when no test cases", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { testCases: [] },
    });

    render(
      <TestCasePanel
        questionId="q1"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        output={null as any}
        isRunning={false}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText("No test cases available")
      ).toBeInTheDocument();
    });
  });

  test("shows running state when isRunning is true", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { testCases: mockTestCases },
    });

    render(
      <TestCasePanel
        questionId="q1"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        output={null as any}
        isRunning={true}
      />
    );

    expect(screen.getByText(/Running your code/i)).toBeInTheDocument();
  });

  test("shows passed output", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { testCases: mockTestCases },
    });

    render(
      <TestCasePanel
        questionId="q1"
        output={{ success: true }}
        isRunning={false}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Output")).toBeInTheDocument();
    });
  });

  test("shows failed test case with expected/actual", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { testCases: mockTestCases },
    });

    render(
      <TestCasePanel
        questionId="q1"
        output={{
          success: false,
          failedTest: 1,
          expected: "3",
          actual: "4",
        }}
        isRunning={false}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Expected")).toBeInTheDocument();
      expect(screen.getByText("Actual Output")).toBeInTheDocument();
    });
  });

  test("shows error message when failure has message", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { testCases: mockTestCases },
    });

    render(
      <TestCasePanel
        questionId="q1"
        output={{
          success: false,
          failedTest: 1,
          message: "Runtime Error",
        }}
        isRunning={false}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Error Happens")).toBeInTheDocument();
      expect(screen.getByText("Runtime Error")).toBeInTheDocument();
    });
  });

  test("calls API with correct URL", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { testCases: mockTestCases },
    });

    render(
      <TestCasePanel
        questionId="q123"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        output={null as any}
        isRunning={false}
      />
    );

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/api/testcase/visible/q123")
      );
    });
  });
});