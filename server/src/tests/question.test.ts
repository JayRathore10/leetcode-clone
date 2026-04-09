import request from "supertest";
import app from "../app";
import { questionModel } from "../models/question.model";
import { isUserLoggedIn } from "../middleware/auth.middleware";

jest.mock("../models/question.model.ts");
jest.mock("../middleware/auth.middleware", () => ({
  isUserLoggedIn: jest.fn()
}));

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
})

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

})

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

})