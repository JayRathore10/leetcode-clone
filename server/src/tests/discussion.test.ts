import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import { discussionModel } from "../models/discussion.model";
import { userModel } from "../models/user.model";

jest.mock("../models/discussion.model");
jest.mock("../models/user.model");
jest.mock("jsonwebtoken");

describe("POST /api/discussion", () => {
  it("should create discussion successfully", async () => {
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

    (discussionModel.create as jest.Mock).mockResolvedValue({
      title: "Binary Search",
      content: "How to solve binary search efficiently?",
      category: "Problem",
    });

    const res = await request(app)
      .post("/api/discussion")
      .set("Cookie", "token=fake_token")
      .send({
        title: "Binary Search",
        content: "How to solve binary search efficiently?",
        category: "Problem",
        tags: ["binary-search", "dsa"],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Discussion created successfully");
  });

  it("should return 400 if required fields are missing", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({
      email: "user@gmail.com",
      role: "user",
    });

    (userModel.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: "user123",
      }),
    });

    const res = await request(app)
      .post("/api/discussion")
      .set("Cookie", "token=fake_token")
      .send({
        title: "",
        content: "",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(
      "Title, content and category are required"
    );
  });

  it("should return 401 if token is not provided", async () => {
    const res = await request(app)
      .post("/api/discussion")
      .send({
        title: "Binary Search",
        content: "Content",
        category: "Problem",
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Token not Found");
  });

  it("should return 401 if user is not found", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({
      email: "user@gmail.com",
    });

    (userModel.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    const res = await request(app)
      .post("/api/discussion")
      .set("Cookie", "token=fake_token")
      .send({
        title: "Binary Search",
        content: "Content",
        category: "Problem",
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("User not found");
  });
});

describe("GET /api/discussion", () => {
  it("should return all discussions", async () => {
    const limit = jest.fn().mockResolvedValue([
      {
        title: "Discussion 1",
      },
      {
        title: "Discussion 2",
      },
    ]);

    const skip = jest.fn().mockReturnValue({
      limit,
    });

    const sort = jest.fn().mockReturnValue({
      skip,
    });

    const populate = jest.fn().mockReturnValue({
      sort,
    });

    (discussionModel.find as jest.Mock).mockReturnValue({
      populate,
    });

    (discussionModel.countDocuments as jest.Mock).mockResolvedValue(2);

    const res = await request(app).get("/api/discussion");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.discussions).toBeDefined();
    expect(res.body.discussions.length).toBe(2);
    expect(res.body.totalDiscussions).toBe(2);
  });
});

describe("GET /api/discussion/:discussionId", () => {
  it("should return discussion by id", async () => {
    const populate = jest.fn().mockResolvedValue({
      _id: "discussion123",
      title: "Binary Search",
    });

    (discussionModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
      populate,
    });

    const res = await request(app).get(
      "/api/discussion/discussion123"
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.discussion.title).toBe("Binary Search");
  });

  it("should return 404 if discussion is not found", async () => {
    const populate = jest.fn().mockResolvedValue(null);

    (discussionModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
      populate,
    });

    const res = await request(app).get(
      "/api/discussion/discussion123"
    );

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Discussion not found");
  });
});

describe("PUT /api/discussion/:discussionId", () => {
  it("should update discussion successfully", async () => {
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

    const discussion = {
      _id: "discussion123",
      title: "Old Title",
      content: "Old Content",
      category: "Problem",
      tags: ["old"],
      author: {
        toString: () => "user123",
      },
      locked: false,
      save: jest.fn().mockResolvedValue(true),
    };

    (discussionModel.findById as jest.Mock).mockResolvedValue(discussion);

    const res = await request(app)
      .put("/api/discussion/discussion123")
      .set("Cookie", "token=fake_token")
      .send({
        title: "Updated Title",
        content: "Updated Content",
        category: "Contest",
        tags: ["contest"],
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Discussion updated successfully");
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
      .put("/api/discussion/discussion123")
      .set("Cookie", "token=fake_token")
      .send({
        title: "Updated Title",
      });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Discussion not found");
  });

  it("should return 403 if user is not the author", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({
      email: "user@gmail.com",
    });

    (userModel.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: "user123",
      }),
    });

    (discussionModel.findById as jest.Mock).mockResolvedValue({
      author: {
        toString: () => "anotherUser",
      },
      locked: false,
    });

    const res = await request(app)
      .put("/api/discussion/discussion123")
      .set("Cookie", "token=fake_token")
      .send({
        title: "Updated Title",
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(
      "You are not authorized to edit this discussion"
    );
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
      author: {
        toString: () => "user123",
      },
      locked: true,
    });

    const res = await request(app)
      .put("/api/discussion/discussion123")
      .set("Cookie", "token=fake_token")
      .send({
        title: "Updated Title",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("This discussion is locked");
  });
});

describe("DELETE /api/discussion/:discussionId", () => {
  it("should delete discussion successfully", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({
      email: "user@gmail.com",
      role: "user",
    });

    (userModel.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: "user123",
      }),
    });

    (discussionModel.findById as jest.Mock).mockResolvedValue({
      author: {
        toString: () => "user123",
      },
      deleteOne: jest.fn().mockResolvedValue(true),
    });

    const res = await request(app)
      .delete("/api/discussion/discussion123")
      .set("Cookie", "token=fake_token");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Discussion deleted successfully");
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
      .delete("/api/discussion/discussion123")
      .set("Cookie", "token=fake_token");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Discussion not found");
  });

  it("should return 403 if user is not the author", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({
      email: "user@gmail.com",
    });

    (userModel.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: "user123",
      }),
    });

    (discussionModel.findById as jest.Mock).mockResolvedValue({
      author: {
        toString: () => "anotherUser",
      },
    });

    const res = await request(app)
      .delete("/api/discussion/discussion123")
      .set("Cookie", "token=fake_token");

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(
      "You are not authorized to delete this discussion"
    );
  });
});