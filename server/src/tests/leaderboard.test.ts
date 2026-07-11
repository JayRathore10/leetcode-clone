import request from "supertest";
import app from "../app";
import { submissionModel } from "../models/submission.model";

jest.mock("../models/submission.model");

describe("GET /api/leaderboard", () => {
  it("should return leaderboard successfully", async () => {
    (submissionModel.aggregate as jest.Mock).mockResolvedValue([
      {
        username: "jay",
        profilePic: "jay.jpg",
        problemsSolved: 10,
      },
      {
        username: "rahul",
        profilePic: "rahul.jpg",
        problemsSolved: 8,
      },
    ]);

    const res = await request(app).get("/api/leaderboard");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.leaderboard).toBeDefined();
    expect(res.body.leaderboard.length).toBe(2);
    expect(res.body.leaderboard[0].username).toBe("jay");
    expect(res.body.leaderboard[0].problemsSolved).toBe(10);
  });

  it("should return empty leaderboard if no submissions exist", async () => {
    (submissionModel.aggregate as jest.Mock).mockResolvedValue([]);

    const res = await request(app).get("/api/leaderboard");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.leaderboard).toEqual([]);
  });
});