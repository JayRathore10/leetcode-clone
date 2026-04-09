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


describe("DELETE /api/question/delete/:questionId", () => {
  it("should return 404 when question not found in database for deletion", async () => {
    (questionModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

    const res = await request(app).
      delete("/api/question/delete/1234");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      message: "Question Not found"
    });
  });

  it("should return 200 when it successfully delete question", async () => {
    (questionModel.findByIdAndDelete as jest.Mock).mockResolvedValue({
      _id: "1234"
    });

    const res = await request(app).
      delete("/api/question/delete/1234");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "Question delete successfully"
    });
  });
});

describe("POST /api/question/add", () => {
  it("should return 400 when validation fails", async () => {
    const res = await request(app).
      post("/api/question/add")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  })

  it("should return 400 when there is an error in creating new question in database", async () => {
    (questionModel.create as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .post("/api/question/add")
      .send({
        title: "Two Sum",
        description: "desc",
        difficulty: "Easy",
        tags: ["array"],
        constraints: ["1 <= n <= 10^5"],
        example: {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] = 9"
        }
      });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      success: false,
      message: "New Question is not created"
    });
  });

  it("should return 201 when new question is successfully created", async () => {
    (questionModel.create as jest.Mock).mockReturnValue({
      title: "Two Sum",
      description: "desc",
      difficulty: "Easy",
      tags: ["array"],
      constraints: ["1 <= n <= 10^5"],
      example: {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] = 9"
      }
    });

    const res = await request(app)
      .post("/api/question/add")
      .send({
        title: "Two Sum",
        description: "desc",
        difficulty: "Easy",
        tags: ["array"],
        constraints: ["1 <= n <= 10^5"],
        example: {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] = 9"
        }
      });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      success: true,
      message: "New Question Created",
      data: {
        newQuestion: {
          title: "Two Sum",
          description: "desc",
          difficulty: "Easy",
          tags: ["array"],
          constraints: ["1 <= n <= 10^5"],
          example: {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            explanation: "Because nums[0] + nums[1] = 9"
          }
        }
      }
    });

  })

});

describe("GET /api/question/all", () => {
  it("should return 404 when there is not question in database", async () => {
    (questionModel.find as jest.Mock).mockResolvedValue([]);

    const res = await request(app).
      get("/api/question/all");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      message: "There is not question in database"
    });
  })

  it("should return 200 when successfully return all question present in databases", async () => {
    (questionModel.find as jest.Mock).mockResolvedValue(["1"]);

    const res = await request(app).
      get("/api/question/all");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "This are all questions",
      questions :  ["1"]
    });
  })

});

describe("POST /api/question/run", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 when the req fields are not present", async () => {
    const res = await request(app)
      .post("/api/question/run")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      success: false,
      message: "Code  , language or questionId is not mentioned"
    });
  });

  it("should return 404 when no test cases found", async () => {
    (testCaseModel.find as jest.Mock).mockResolvedValue([]);

    const res = await request(app)
      .post("/api/question/run")
      .send({
        questionId: "123",
        language: "cpp",
        code: "print()"
      });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      message: "Not Test Case found"
    });
  });

  const mockTestCases = [
    { input: "1 2", output: "3" }
  ];

  it("should return compilation error", async () => {
    (testCaseModel.find as jest.Mock).mockResolvedValue(mockTestCases);

    mockedAxios.post.mockResolvedValue({
      data: {
        compile: { stderr: "syntax error" }
      }
    } as any);

    const res = await request(app)
      .post("/api/question/run")
      .send({
        questionId: "123",
        language: "cpp",
        code: "wrong code"
      });

    expect(res.body.status).toBe("WA");
    expect(res.body.errorType).toBe("Compilation Error");
  });

  it("should return TLE", async () => {
    (testCaseModel.find as jest.Mock).mockResolvedValue(mockTestCases);

    mockedAxios.post.mockResolvedValue({
      data: {
        run: { signal: "SIGXCPU" }
      }
    } as any);

    const res = await request(app)
      .post("/api/question/run")
      .send({
        questionId: "123",
        language: "cpp",
        code: "while(true){}"
      });

    expect(res.body.status).toBe("TLE");
    expect(res.body.failedTest).toBe(1);
  });

  it("should return MLE", async () => {
    (testCaseModel.find as jest.Mock).mockResolvedValue(mockTestCases);

    mockedAxios.post.mockResolvedValue({
      data: {
        run: { signal: "SIGSEGV" }
      }
    } as any);

    const res = await request(app)
      .post("/api/question/run")
      .send({
        questionId: "123",
        language: "cpp",
        code: "huge memory"
      });

    expect(res.body.status).toBe("MLE");
  });

  it("should return runtime error", async () => {
    (testCaseModel.find as jest.Mock).mockResolvedValue(mockTestCases);

    mockedAxios.post.mockResolvedValue({
      data: {
        run: { stderr: "runtime crash" }
      }
    } as any);

    const res = await request(app)
      .post("/api/question/run")
      .send({
        questionId: "123",
        language: "cpp",
        code: "divide by zero"
      });

    expect(res.body.errorType).toBe("Runtime Error");
  });

  it("should return WA when output mismatches", async () => {
    (testCaseModel.find as jest.Mock).mockResolvedValue(mockTestCases);

    mockedAxios.post.mockResolvedValue({
      data: {
        run: { stdout: "5" }
      }
    } as any);

    const res = await request(app)
      .post("/api/question/run")
      .send({
        questionId: "123",
        language: "cpp",
        code: "wrong logic"
      });

    expect(res.body.status).toBe("WA");
    expect(res.body.expected).toBe("3");
    expect(res.body.actual).toBe("5");
  });

  it("should return success when all test cases pass", async () => {
    (testCaseModel.find as jest.Mock).mockResolvedValue([
      { input: "1 2", output: "3" },
      { input: "2 3", output: "5" }
    ]);

    mockedAxios.post
      .mockResolvedValueOnce({
        data: { run: { stdout: "3" } }
      } as any)
      .mockResolvedValueOnce({
        data: { run: { stdout: "5" } }
      } as any);

    const res = await request(app)
      .post("/api/question/run")
      .send({
        questionId: "123",
        language: "cpp",
        code: "correct code"
      });

    expect(res.body.success).toBe(true);
    expect(res.body.result.length).toBe(2);
  });

});