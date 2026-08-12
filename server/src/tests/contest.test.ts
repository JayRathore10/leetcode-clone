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
        title: "Updated Contest",
        description: "Updated Description",
        startTime: new Date("2030-01-02T10:00:00.000Z"),
        endTime: new Date("2030-01-02T12:00:00.000Z"),
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
      role: "admin"
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
    expect(res.body.message).toBe("User is not found");
  });
});

describe("GET /api/contest", () => {
  it("should return all contests", async () => {
    (contestModel.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([
          {
            title: "Contest 1",
            startTime: new Date("2030-01-02T10:00:00.000Z"),
            endTime: new Date("2030-01-02T12:00:00.000Z"),

            toObject: jest.fn().mockReturnValue({
              title: "Contest 1",
              startTime: new Date("2030-01-02T10:00:00.000Z"),
              endTime: new Date("2030-01-02T12:00:00.000Z"),
            }),
          },
          {
            title: "Contest 2",
            startTime: new Date("2030-01-03T10:00:00.000Z"),
            endTime: new Date("2030-01-03T12:00:00.000Z"),

            toObject: jest.fn().mockReturnValue({
              title: "Contest 2",
              startTime: new Date("2030-01-03T10:00:00.000Z"),
              endTime: new Date("2030-01-03T12:00:00.000Z"),
            }),
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
      startTime: new Date("2030-01-02T10:00:00.000Z"),
      endTime: new Date("2030-01-02T12:00:00.000Z"),
      toObject: jest.fn().mockReturnValue({
        _id: "contest123",
        title: "Weekly Contest",
        startTime: new Date("2030-01-02T10:00:00.000Z"),
        endTime: new Date("2030-01-02T12:00:00.000Z"),
      }),
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

describe("PUT /api/contest/:contestId", () => {
  it("should update contest successfully", async () => {
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

    const contest = {
      _id: "contest123",
      title: "Old Contest",
      description: "Old Description",
      startTime: new Date("2030-01-01T10:00:00.000Z"),
      endTime: new Date("2030-01-01T12:00:00.000Z"),
      duration: 120,
      status: "Upcoming",
      save: jest.fn().mockResolvedValue(true),
    };

    (contestModel.findById as jest.Mock).mockResolvedValue(contest);

    const res = await request(app)
      .put("/api/contest/contest123")
      .set("Cookie", "token=fake_token")
      .send({
        title: "Updated Contest",
        description: "Updated Description",
        startTime: new Date("2030-01-02T10:00:00.000Z"),
        endTime: new Date("2030-01-02T12:00:00.000Z"),
      });
    ;

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Contest updated successfully.");
  });

  it("should return 404 if contest is not found", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({
      email: "admin@gmail.com",
      role: "admin",
    });

    (userModel.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: "user123",
        email: "admin@gmail.com",
      }),
    });

    (contestModel.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .put("/api/contest/contest123")
      .set("Cookie", "token=fake_token")
      .send({
        title: "Updated Contest",
      });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Contest not found.");
  });

  it("should return 400 if contest has already started", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({
      email: "admin@gmail.com",
      role: "admin",
    });

    (userModel.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: "user123",
        email: "admin@gmail.com",
      }),
    });

    (contestModel.findById as jest.Mock).mockResolvedValue({
      startTime: new Date("2020-01-01T10:00:00.000Z"),
      endTime: new Date("2020-01-01T12:00:00.000Z"),
    });

    const res = await request(app)
      .put("/api/contest/contest123")
      .set("Cookie", "token=fake_token")
      .send({
        title: "Updated Contest",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Contest has already started.");
  });
});

describe("DELETE /api/contest/:contestId", () => {
  it("should delete contest successfully", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({
      email: "admin@gmail.com",
      role: "admin",
    });

    (userModel.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: "user123",
        email: "admin@gmail.com",
      }),
    });

    (contestModel.findById as jest.Mock).mockResolvedValue({
      deleteOne: jest.fn().mockResolvedValue(true),
    });

    const res = await request(app)
      .delete("/api/contest/contest123")
      .set("Cookie", "token=fake_token");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Contest deleted successfully.");
  });

  it("should return 404 if contest is not found", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({
      email: "admin@gmail.com",
      role: "admin",
    });

    (userModel.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: "user123",
        email: "admin@gmail.com",
      }),
    });

    (contestModel.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .delete("/api/contest/contest123")
      .set("Cookie", "token=fake_token");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Contest not found.");
  });
});

describe("POST /api/contest/:contestId/register", () => {
  it("should register user successfully", async () => {
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

    const contest = {
      startTime: new Date("2030-01-02T10:00:00.000Z"),
      endTime: new Date("2030-01-02T12:00:00.000Z"),
      participants: [],
      save: jest.fn().mockResolvedValue(true),
    };

    (contestModel.findById as jest.Mock).mockResolvedValue(contest);

    const res = await request(app)
      .post("/api/contest/contest123/register")
      .set("Cookie", "token=fake_token");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Registered successfully.");
  });

  it("should return 404 if contest is not found", async () => {
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

    (contestModel.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .post("/api/contest/contest123/register")
      .set("Cookie", "token=fake_token");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Contest not found.");
  });

  it("should return 400 if contest has ended", async () => {
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

    (contestModel.findById as jest.Mock).mockResolvedValue({
      startTime: new Date("2020-01-01T10:00:00.000Z"),
      endTime: new Date("2020-01-01T12:00:00.000Z"),
      participants: [],
    });

    const res = await request(app)
      .post("/api/contest/contest123/register")
      .set("Cookie", "token=fake_token");

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Registration is closed.");
  });

  it("should return 400 if user is already registered", async () => {
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

    (contestModel.findById as jest.Mock).mockResolvedValue({
      status: "Upcoming",
      participants: ["user123"],
    });

    const res = await request(app)
      .post("/api/contest/contest123/register")
      .set("Cookie", "token=fake_token");

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(
      "You are already registered for this contest."
    );
  });
});

describe("DELETE /api/contest/:contestId/unregister", () => {
  it("should unregister successfully", async () => {
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

    (contestModel.findById as jest.Mock).mockResolvedValue({
      startTime: new Date("2030-01-02T10:00:00.000Z"),
      participants: ["user123", "user456"],
      save: jest.fn().mockResolvedValue(true),
    });

    const res = await request(app)
      .delete("/api/contest/contest123/unregister")
      .set("Cookie", "token=fake_token");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Unregistered successfully.");
  });

  it("should return 404 if contest is not found", async () => {
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

    (contestModel.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .delete("/api/contest/contest123/unregister")
      .set("Cookie", "token=fake_token");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Contest not found.");
  });
});

describe("GET /api/contest/my/registered", () => {
  it("should return all registered contests", async () => {
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

    (contestModel.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([
          {
            title: "Weekly Contest 1",
          },
          {
            title: "Weekly Contest 2",
          },
        ]),
      }),
    });

    const res = await request(app)
      .get("/api/contest/my/registered")
      .set("Cookie", "token=fake_token");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.contests).toBeDefined();
    expect(res.body.contests.length).toBe(2);
  });
});