import { Request, Response, NextFunction } from "express";
import { errorMiddleware } from "../middleware/error.middleware";

describe("errorMiddleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    mockNext = jest.fn();
  });

  // 🔹 Default error (500)
  it("should return 500 for generic error", async () => {
    const err = new Error("Something went wrong");

    await errorMiddleware(err, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: "Something went wrong"
    });
  });

  // 🔹 CastError (invalid ObjectId)
  it("should handle CastError and return 404", async () => {
    const err: any = {
      name: "CastError",
      message: "Invalid ID"
    };

    await errorMiddleware(err, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: "Resource not found"
    });
  });

  // 🔹 Duplicate key error
  it("should handle duplicate key error (11000)", async () => {
    const err: any = {
      code: 11000,
      message: "Duplicate key"
    };

    await errorMiddleware(err, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: "Duplicate field value entered"
    });
  });

  // 🔹 Validation error
  it("should handle validation error and return 400", async () => {
    const err: any = {
      name: "ValidationError",
      errors: {
        email: { message: "Email is required" },
        password: { message: "Password too short" }
      }
    };

    await errorMiddleware(err, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: "Email is required,Password too short"
    });
  });

  // 🔹 Catch block fallback
  it("should handle unexpected failure inside middleware", async () => {
    const err: any = null; // this will break err.message access

    await errorMiddleware(err, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: "Server Error"
    });
  });
});