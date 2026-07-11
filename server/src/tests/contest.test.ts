import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import { contestModel } from "../models/contest.model";
import { userModel } from "../models/user.model";

jest.mock("../models/contest.model");
jest.mock("../models/user.model");
jest.mock("jsonwebtoken");

describe("POST /api/contest", () => {
  it("should create contest successfully", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({
      email: "admin@gmail.com",
      role: "admin",
    });

    (userModel.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: "user123",
        email: "admin@gmail.com",
        username: "admin",
      }),
    });

    (contestModel.create as jest.Mock).mockResolvedValue({
      title: "Weekly Contest",
      description: "Contest Description",
    });

    const res = await request(app)
      .post("/api/contest")
      .set("Cookie", "token=fake_token")
      .send({
        title: "Weekly Contest",
        description: "Contest Description",
        startTime: "2030-01-01T10:00:00.000Z",
        endTime: "2030-01-01T12:00:00.000Z",
        isPublic: true,
        problems: [],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Contest created successfully.");
  });

  it("should return 401 if token is not provided", async () => {
    const res = await request(app)
      .post("/api/contest")
      .send({
        title: "Contest",
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Token not Found");
  });

  it("should return 401 if user is not found", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({
      email: "admin@gmail.com",
    });

    (userModel.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    const res = await request(app)
      .post("/api/contest")
      .set("Cookie", "token=fake_token")
      .send({
        title: "Contest",
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("User not found");
  });
});

describe("GET /api/contest", () => {
  it("should return all contests", async () => {
    (contestModel.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([
          {
            title: "Contest 1",
          },
          {
            title: "Contest 2",
          },
        ]),
      }),
    });

    const res = await request(app).get("/api/contest");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.contests).toBeDefined();
    expect(res.body.contests.length).toBe(2);
  });
});

describe("GET /api/contest/:contestId", () => {
  it("should return contest by id", async () => {
    const populate3 = jest.fn().mockResolvedValue({
      _id: "contest123",
      title: "Weekly Contest",
    });

    const populate2 = jest.fn().mockReturnValue({
      populate: populate3,
    });

    const populate1 = jest.fn().mockReturnValue({
      populate: populate2,
    });

    (contestModel.findById as jest.Mock).mockReturnValue({
      populate: populate1,
    });

    const res = await request(app).get("/api/contest/contest123");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.contest.title).toBe("Weekly Contest");
  });

  it("should return 404 if contest is not found", async () => {
    const populate3 = jest.fn().mockResolvedValue(null);

    const populate2 = jest.fn().mockReturnValue({
      populate: populate3,
    });

    const populate1 = jest.fn().mockReturnValue({
      populate: populate2,
    });

    (contestModel.findById as jest.Mock).mockReturnValue({
      populate: populate1,
    });

    const res = await request(app).get("/api/contest/123");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Contest not found.");
  });
});