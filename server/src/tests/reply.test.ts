import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model";
import { replyModel } from "../models/reply.model";
import { discussionModel } from "../models/discussion.model";

jest.mock("../models/user.model");
jest.mock("../models/reply.model");
jest.mock("../models/discussion.model");
jest.mock("jsonwebtoken");

describe("POST /api/reply", () => {
  it("should create reply successfully", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({
      email: "user@gmail.com",
      role: "user",
    });

    (userModel.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: "user123",
        email: "user@gmail.com",
      }),
    });

    (discussionModel.findById as jest.Mock).mockResolvedValue({
      locked: false,
      replyCount: 0,
      save: jest.fn().mockResolvedValue(true),
    });

    (replyModel.create as jest.Mock).mockResolvedValue({
      _id: "reply123",
      content: "Nice problem!",
    });

    const res = await request(app)
      .post("/api/reply")
      .set("Cookie", "token=fake_token")
      .send({
        discussionId: "discussion123",
        content: "Nice problem!",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Reply added successfully");
  });

  it("should return 400 if discussionId or content is missing", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({
      email: "user@gmail.com",
    });

    (userModel.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: "user123",
      }),
    });

    const res = await request(app)
      .post("/api/reply")
      .set("Cookie", "token=fake_token")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(
      "Discussion Id and content are required"
    );
  });

  it("should return 404 if discussion is not found", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({
      email: "user@gmail.com",
    });

    (userModel.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: "user123",
      }),
    });

    (discussionModel.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .post("/api/reply")
      .set("Cookie", "token=fake_token")
      .send({
        discussionId: "discussion123",
        content: "Hello",
      });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Discussion not found");
  });

  it("should return 400 if discussion is locked", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({
      email: "user@gmail.com",
    });

    (userModel.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: "user123",
      }),
    });

    (discussionModel.findById as jest.Mock).mockResolvedValue({
      locked: true,
    });

    const res = await request(app)
      .post("/api/reply")
      .set("Cookie", "token=fake_token")
      .send({
        discussionId: "discussion123",
        content: "Hello",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("This discussion is locked");
  });

  it("should return 404 if parent reply is not found", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({
      email: "user@gmail.com",
    });

    (userModel.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: "user123",
      }),
    });

    (discussionModel.findById as jest.Mock).mockResolvedValue({
      locked: false,
    });

    (replyModel.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .post("/api/reply")
      .set("Cookie", "token=fake_token")
      .send({
        discussionId: "discussion123",
        content: "Hello",
        parentReply: "reply1",
      });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Parent reply not found");
  });
});

describe("GET /api/reply/discussion/:discussionId", () => {
  it("should return replies", async () => {
    (replyModel.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([
          {
            content: "First Reply",
          },
          {
            content: "Second Reply",
          },
        ]),
      }),
    });

    const res = await request(app).get(
      "/api/reply/discussion/discussion123"
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.totalReplies).toBe(2);
    expect(res.body.replies.length).toBe(2);
  });
});

describe("PUT /api/reply/:replyId", () => {
  it("should update reply successfully", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({
      email: "user@gmail.com",
    });

    (userModel.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: "user123",
      }),
    });

    const reply = {
      author: {
        toString: () => "user123",
      },
      content: "Old",
      edited: false,
      save: jest.fn().mockResolvedValue(true),
    };

    (replyModel.findById as jest.Mock).mockResolvedValue(reply);

    const res = await request(app)
      .put("/api/reply/reply123")
      .set("Cookie", "token=fake_token")
      .send({
        content: "Updated Reply",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Reply updated successfully");
  });
});