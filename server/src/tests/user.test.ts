import { userModel } from "../models/user.model";
import app from "../app";
import { isUserLoggedIn } from "../middleware/auth.middleware";
import request from "supertest";


jest.mock("../models/user.model");
jest.mock("../middleware/auth.middleware", () => ({
  isUserLoggedIn: jest.fn()
}));

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

})
