import request from "supertest";
import app from "../app";
import { submissionModel } from "../models/submission.model";

jest.mock("../models/submission.model");
jest.mock("../middleware/auth.middleware", () => ({
  isUserLoggedIn: (req: any, res: any, next: any) => {
    req.user = { _id: "user123" };
    next();
  }
}));

describe("POST /api/submission", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 when validation fails", async () => {
    const res = await request(app)
      .post("/api/submission")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 400 when submission is not created", async () => {
    (submissionModel.create as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .post("/api/submission")
      .send({
        questionId: "1",
        code: "test",
        language: "cpp",
        status: "Accepted",
        title: "Two Sum"
      });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      success: false,
      message: "Error in creating Submission"
    });
  });

  it("should return 201 when submission is created", async () => {
    const mockSubmission = {
      _id: "1",
      questionId: "1",
      code: "test",
      language: "cpp",
      status: "Accepted",
      title: "Two Sum",
      userId: "user123"
    };

    (submissionModel.create as jest.Mock).mockResolvedValue(mockSubmission);

    const res = await request(app)
      .post("/api/submission")
      .send({
        questionId: "1",
        code: "test",
        language: "cpp",
        status: "Accepted",
        title: "Two Sum"
      });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      success: true,
      message: "New Submission Created",
      submission: mockSubmission
    });
  });

});

describe("GET /api/submission", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 when no submissions exist", async () => {
    (submissionModel.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([])
    });

    const res = await request(app)
      .get("/api/submission");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: false,
      message: "User don't have any submissions"
    });
  });

  it("should return 200 with user submissions", async () => {
    const mockData = [{ _id: "1" }];

    (submissionModel.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(mockData)
    });

    const res = await request(app)
      .get("/api/submission");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "User's All Submissions",
      submissions: mockData
    });
  });

});

describe("GET /api/submission/:id", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 404 when submission not found", async () => {
    (submissionModel.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(null)
    });

    const res = await request(app)
      .get("/api/submission/123");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      message: "Submission not found"
    });
  });

  it("should return 200 when submission is found", async () => {
    const mockSubmission = { _id: "123" };

    (submissionModel.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockSubmission)
    });

    const res = await request(app)
      .get("/api/submission/123");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      messaage: "Submission",
      submission: mockSubmission
    });
  });

});