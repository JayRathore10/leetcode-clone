import request from "supertest";
import app from "../app";
import { questionModel } from "../models/question.model";
import { isUserLoggedIn } from "../middleware/auth.middleware";
import axios from "axios";
import { testCaseModel } from "../models/testCase.model";

jest.mock("../models/question.model.ts");
jest.mock("../models/testCase.model.ts");
jest.mock("../middleware/auth.middleware", () => ({
  isUserLoggedIn:  (req: any, res: any, next: any) => next()
}));
jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("GET /api/testcase/visible/:questionId", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 404 when no visible test cases found", async () => {
    (testCaseModel.find as jest.Mock).mockResolvedValue([]);

    const res = await request(app)
      .get("/api/testcase/visible/123");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      message: "Test Cases are not found"
    });
  });

  it("should return 200 with visible test cases", async () => {
    const mockTestCases = [
      { input: "1 2", output: "3", isHidden: false },
      { input: "2 3", output: "5", isHidden: false }
    ];

    (testCaseModel.find as jest.Mock).mockResolvedValue(mockTestCases);

    const res = await request(app)
      .get("/api/testcase/visible/123");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "These are the test cases",
      testCases: mockTestCases
    });
  });
});

describe("GET /api/testcase/hidden/:questionId", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 404 when no hidden test cases found", async () => {
    (testCaseModel.find as jest.Mock).mockResolvedValue([]);

    const res = await request(app)
      .get("/api/testcase/hidden/123");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      message: "No test Case found"
    });
  });

  it("should return 200 with hidden test cases", async () => {
    const mockTestCases = [
      { input: "1 2", output: "3", isHidden: true },
      { input: "2 3", output: "5", isHidden: true }
    ];

    (testCaseModel.find as jest.Mock).mockResolvedValue(mockTestCases);

    const res = await request(app)
      .get("/api/testcase/hidden/123");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "These are all hidden test cases",
      testCases: mockTestCases
    });
  });

});