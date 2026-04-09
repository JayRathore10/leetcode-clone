import request from "supertest";
import app from "../app";
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



describe("POST /api/testcase/add", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 when validation fails", async () => {
    const res = await request(app)
      .post("/api/testcase/add")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 400 when test case is not created", async () => {
    (testCaseModel.insertMany as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .post("/api/testcase/add")
      .send([
        {
          input: "1 2",
          output: "3",
          questionId: "123",
          isHidden: false
        }
      ]);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      success: false,
      message: "New Test case is not created"
    });
  });

  it("should return 201 when test cases are created", async () => {
    const mockData = [
      {
        input: "1 2",
        output: "3",
        questionId: "123",
        isHidden: false
      }
    ];

    (testCaseModel.insertMany as jest.Mock).mockResolvedValue(mockData);

    const res = await request(app)
      .post("/api/testcase/add")
      .send(mockData);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      success: true,
      message: "New Test Case Created",
      newTestCases: mockData
    });
  });

});

describe("DELETE /api/testcase/delete/:testCaseId", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 404 when test case not found", async () => {
    (testCaseModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .delete("/api/testcase/delete/123");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      message: "Not Test Case found"
    });
  });

  it("should return 200 when test case is deleted", async () => {
    (testCaseModel.findByIdAndDelete as jest.Mock).mockResolvedValue({
      _id: "123"
    });

    const res = await request(app)
      .delete("/api/testcase/delete/123");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "This test case deleted"
    });
  });

});