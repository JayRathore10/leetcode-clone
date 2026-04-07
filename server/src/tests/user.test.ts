import { userModel } from "../models/user.model";
import app from "../app";
import { isUserLoggedIn } from "../middleware/auth.middleware";
import { Request, Response, NextFunction } from "express";
import { editProfile } from "../controllers/user.controller";
import { authRequest } from "../types/authRequest.type";
import request from "supertest";
import { submissionModel } from "../models/submission.model";


jest.mock("../models/user.model");
jest.mock("../middleware/auth.middleware", () => ({
  isUserLoggedIn: jest.fn()
}));
jest.mock("../models/submission.model");

describe("GET /api/users/test", () => {
  it("should return 200 for success run", async () => {
    const res = await request(app).
      get("/api/users/test");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Hello");
  });
});

describe("GET /api/users/all", () => {
  it("should return 404 when there is no user in database", async () => {
    (userModel.find as jest.Mock).mockResolvedValue([]);

    const res = await request(app).
      get("/api/users/all");

    expect(res.status).toBe(404);
  })

  it("should return 200 when successfully return all users in database", async () => {

    (userModel.find as jest.Mock).mockResolvedValue(["user"]);

    const res = await request(app).
      get("/api/users/all");

    expect(res.status).toBe(200);
  })
});

describe("GET /api/users/profile", () => {
  it("should return 400 when Error in getting user details", async () => {

    (isUserLoggedIn as jest.Mock).mockImplementation((req: any, res: any, next: any) => {
      req.user = null;
      next();
    })

    const res = await request(app).
      get("/api/users/profile");

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Error in getting user detail");
  })

  it("should return 404 when the user is not found in database", async () => {

    (userModel.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });

    (isUserLoggedIn as jest.Mock).mockImplementation((req: any, res: any, next: any) => {
      req.user = { _id: "123" };
      next();
    })

    const res = await request(app).
      get("/api/users/profile");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

  it("should return 200 when user data exists", async () => {
    (userModel.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: "1243",
      })
    });

    (isUserLoggedIn as jest.Mock).mockImplementation((req: any, res: any, next: any) => {
      req.user = { _id: "1234" };
      next();
    });

    const res = await request(app).
      get("/api/users/profile");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User Data");
    expect(res.body.user).toBeDefined();
  })
});

describe("PUT /api/users/profile", () => {
  let mockReq: Partial<authRequest>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    mockNext = jest.fn();

    jest.spyOn(console, "error").mockImplementation(() => { });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 400 if user not found", async () => {
    mockReq = {
      body: { name: "John" },
      user: undefined
    };

    await editProfile(mockReq as authRequest, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Can not find Error",
      success: false
    });
  });

  it("should update user name", async () => {
    const saveMock = jest.fn().mockResolvedValue(true);

    mockReq = {
      body: { name: "John" },
      user: {
        name: "Old",
        profilePic: "old.png",
        save: saveMock
      } as any
    };

    await editProfile(mockReq as authRequest, mockRes as Response, mockNext);

    expect(mockReq.user?.name).toBe("John");
    expect(saveMock).toHaveBeenCalled();

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      message: "Profile Updated"
    });
  });

  it("should update profile picture", async () => {
    const saveMock = jest.fn().mockResolvedValue(true);

    mockReq = {
      body: {},
      file: {
        filename: "newpic.png"
      } as Express.Multer.File,
      user: {
        name: "Old",
        profilePic: "old.png",
        save: saveMock
      } as any
    };

    await editProfile(mockReq as authRequest, mockRes as Response, mockNext);

    expect(mockReq.user?.profilePic).toBe("newpic.png");
    expect(saveMock).toHaveBeenCalled();

    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it("should update both name and profile pic", async () => {
    const saveMock = jest.fn().mockResolvedValue(true);

    mockReq = {
      body: { name: "John" },
      file: {
        filename: "newpic.png"
      } as Express.Multer.File,
      user: {
        name: "Old",
        profilePic: "old.png",
        save: saveMock
      } as any
    };

    await editProfile(mockReq as authRequest, mockRes as Response, mockNext);

    expect(mockReq.user?.name).toBe("John");
    expect(mockReq.user?.profilePic).toBe("newpic.png");
    expect(saveMock).toHaveBeenCalled();
  });

  it("should call next on error", async () => {
    const error = new Error("DB Error");

    const saveMock = jest.fn().mockRejectedValue(error);

    mockReq = {
      body: { name: "John" },
      user: {
        name: "Old",
        save: saveMock
      } as any
    };

    await editProfile(mockReq as authRequest, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

describe("GET /api/users/:username", () => {
  it("should return 404 when user not exits in database ", async () => {
    (userModel.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });

    const res = await request(app).
      get("/api/users/testUser");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      message: "User not found"
    })
  })

  it("should return 200 when user exists in database and return successfully", async () => {
    (userModel.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: "1234"
      })
    });

    const res = await request(app).
      get("/api/users/testUser");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "User Details",
      user: {
        _id: "1234"
      }
    })
  })

});

describe("GET /api/users/:username/all-submission", () => {
  it("should return 404 when user not exits in database", async () => {
    (userModel.findOne as jest.Mock).mockResolvedValue(null);

    const res = await request(app).
      get("/api/users/testUser/all-submissions");


    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      message: "User not found"
    })
  });

  it("should return 200 when the successfully find the submissions and return then", async () => {
    (userModel.findOne as jest.Mock).mockResolvedValue({
      _id: "1234"
    });

    (submissionModel.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue([
        { _id: "sub1", createdAt: "2024-01-01" },
        { _id: "sub2", createdAt: "2024-01-02" }
      ])
    });

    const res = await request(app).
      get("/api/users/testUser/all-submissions");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "All Submissions",
      data: {
        submissions: [
          { _id: "sub1", createdAt: "2024-01-01" },
          { _id: "sub2", createdAt: "2024-01-02" }
        ]
      }
    });

  })

})
