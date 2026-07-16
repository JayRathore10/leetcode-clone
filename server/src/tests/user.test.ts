import request from "supertest";
import app from "../app";
import { userModel } from "../models/user.model";
import { submissionModel } from "../models/submission.model";
import { editProfile } from "../controllers/user.controller";
import { authRequest } from "../types/authRequest.type";
import { Response, NextFunction } from "express";

jest.mock("../models/user.model");
jest.mock("../models/submission.model");

// Mock auth middleware
jest.mock("../middleware/auth.middleware", () => ({
  isUserLoggedIn: (req: any, res: any, next: any) => {
    req.user = {
      _id: "user123",
      name: "John",
      save: jest.fn(),
    };
    next();
  },

  isAdminLoggedIn: (req: any, res: any, next: any) => {
    req.user = {
      _id: "admin123",
      role: "admin",
    };
    next();
  },
}));

describe("GET /api/users/all", () => {
  afterEach(() => jest.clearAllMocks());

  it("should return 404 when no users exist", async () => {
    (userModel.find as jest.Mock).mockResolvedValue([]);

    const res = await request(app).get("/api/users/all");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      message: "No User found",
    });
  });

  it("should return all users", async () => {
    const users = [{ _id: "1" }];

    (userModel.find as jest.Mock).mockResolvedValue(users);

    const res = await request(app).get("/api/users/all");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "All Users",
      data: {
        users,
      },
    });
  });
});

describe("GET /api/users/profile", () => {
  afterEach(() => jest.clearAllMocks());

  it("should return logged in user", async () => {
    const res = await request(app).get("/api/users/profile");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toBeDefined();
    expect(res.body.user._id).toBe("user123");
  });
});

describe("PUT /api/users/profile", () => {
  let mockReq: Partial<authRequest>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  afterEach(() => jest.restoreAllMocks());

  it("should return 400 if user not found", async () => {
    mockReq = {
      body: {},
      user: undefined,
    };

    await editProfile(
      mockReq as authRequest,
      mockRes as Response,
      mockNext
    );

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: "Can not find Error",
    });
  });

  it("should update name", async () => {
    const save = jest.fn().mockResolvedValue(true);

    mockReq = {
      body: { name: "Jay" },
      user: {
        name: "Old",
        profilePic: "old.png",
        save,
      } as any,
    };

    await editProfile(
      mockReq as authRequest,
      mockRes as Response,
      mockNext
    );

    expect(mockReq.user?.name).toBe("Jay");
    expect(save).toHaveBeenCalled();

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      message: "Profile Updated",
    });
  });

  it("should update profile picture", async () => {
    const save = jest.fn().mockResolvedValue(true);

    mockReq = {
      body: {},
      file: {
        filename: "new.png",
      } as Express.Multer.File,
      user: {
        name: "Old",
        profilePic: "old.png",
        save,
      } as any,
    };

    await editProfile(
      mockReq as authRequest,
      mockRes as Response,
      mockNext
    );

    expect(mockReq.user?.profilePic).toBe("new.png");
    expect(save).toHaveBeenCalled();
  });

  it("should update both fields", async () => {
    const save = jest.fn().mockResolvedValue(true);

    mockReq = {
      body: { name: "Jay" },
      file: {
        filename: "new.png",
      } as Express.Multer.File,
      user: {
        name: "Old",
        profilePic: "old.png",
        save,
      } as any,
    };

    await editProfile(
      mockReq as authRequest,
      mockRes as Response,
      mockNext
    );

    expect(mockReq.user?.name).toBe("Jay");
    expect(mockReq.user?.profilePic).toBe("new.png");
    expect(save).toHaveBeenCalled();
  });

  it("should call next on error", async () => {
    const error = new Error("DB Error");

    mockReq = {
      body: { name: "Jay" },
      user: {
        save: jest.fn().mockRejectedValue(error),
      } as any,
    };

    await editProfile(
      mockReq as authRequest,
      mockRes as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

describe("GET /api/users/:username", () => {
  afterEach(() => jest.clearAllMocks());

  it("should return 404 when user not found", async () => {
    (userModel.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    const res = await request(app).get("/api/users/test");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      message: "User not found",
    });
  });

  it("should return user details", async () => {
    const user = { _id: "1" };

    (userModel.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(user),
    });

    const res = await request(app).get("/api/users/test");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "User Details",
      user,
    });
  });
});

describe("GET /api/users/:username/all-submissions", () => {
  afterEach(() => jest.clearAllMocks());

  it("should return 404 when user not found", async () => {
    (userModel.findOne as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get(
      "/api/users/test/all-submissions"
    );

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      message: "User not found",
    });
  });

  it("should return no submissions", async () => {
    (userModel.findOne as jest.Mock).mockResolvedValue({
      _id: "123",
    });

    (submissionModel.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([]),
    });

    const res = await request(app).get(
      "/api/users/test/all-submissions"
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "No Submission found",
      submissions: [],
    });
  });

  it("should return all submissions", async () => {
    const submissions = [
      { _id: "sub1" },
      { _id: "sub2" },
    ];

    (userModel.findOne as jest.Mock).mockResolvedValue({
      _id: "123",
    });

    (submissionModel.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(submissions),
    });

    const res = await request(app).get(
      "/api/users/test/all-submissions"
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "All Submissions",
      submissions,
    });
  });
});