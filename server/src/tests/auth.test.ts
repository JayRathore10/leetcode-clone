import request from "supertest";
import { userModel } from "../models/user.model";
import app from "../app";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

jest.mock("../models/user.model");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("POST /api/auth/login", () => {
  it("should login successfully", async () => {
    // mocking the DB using the jest mock 
    (userModel.findOne as jest.Mock).mockResolvedValue({
      email: "test@gmail.com",
      password: "hashedPassword",
    });

    // mocking bcrypt.compare(passowrd , user.password) 
    (bcrypt.compare as jest.Mock).mockReturnValue(true);

    // mocking jwt token
    (jwt.sign as jest.Mock).mockReturnValue("fake_token");

    const res = await request(app).
      post("/api/auth/login").
      send({
        email: "test@gmail.com",
        password: "123456"
      })

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // take out cookies from the header 
    const cookies = res.headers["set-cookie"];

    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain("token=fake_token");
  });

  it("should return 404 if user is not found in database", async () => {
    // this null means user not found in our database 
    (userModel.findOne as jest.Mock).mockResolvedValue(null);

    const res = await request(app).
      post("/api/auth/login").
      send({
        email: "test@gmail.com",
        password: "12345"
      });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  })

  it("should return 400 if user password is not matching", async () => {
    (userModel.findOne as jest.Mock).mockResolvedValue({
      email: "test@gmail.com",
      password: "12345"
    });

    (bcrypt.compare as jest.Mock).mockReturnValue(false);

    const res = await request(app).
      post("/api/auth/login").
      send({
        email: "test@gmail.com",
        password: "123456"
      })

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);

  })

});

describe("POST /api/auth/register", () => {
  it("should register new user successfully with the status code of 201", async () => {
    (userModel.findOne as jest.Mock).mockResolvedValue(null);

    (bcrypt.genSalt as jest.Mock).mockResolvedValue("***");
    (bcrypt.hash as jest.Mock).mockResolvedValue("12345***");

    (userModel.create as jest.Mock).mockResolvedValue({
      username: "testUser",
      email: "test@gmail.com",
      password: "12345***",
      name: "test"
    });

    (jwt.sign as jest.Mock).mockReturnValue("fake_token");

    const res = await request(app).
      post("/api/auth/register")
      .send({
        username: "testUser",
        email: "test@gmail.com",
        password: "12345***",
        name: "test"
      });

    expect(res.body.message).toBe("User Registered Successfully");
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("should return 400 when there is a zod parsed error", async () => {
    (userModel.findOne as jest.Mock).mockResolvedValue(null);

    (bcrypt.genSalt as jest.Mock).mockResolvedValue("***");
    (bcrypt.hash as jest.Mock).mockResolvedValue("12345***");

    (userModel.create as jest.Mock).mockResolvedValue({
      username: "testUser",
      email: "test@gmail",
      password: "12345***",
      name: "test"
    });

    (jwt.sign as jest.Mock).mockReturnValue("fake_token");

    const res = await request(app).
      post("/api/auth/register")
      .send({
        username: "testUser",
        email: "test@gmail",
        password: "12345***",
        name: "test"
      });

    expect(res.body.message).toBe("parsed error");
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  })

  it("should return 400 when there is a user already exists", async () => {
    (userModel.findOne as jest.Mock).mockResolvedValue({
      username: "testUser11",
      email: "test@gmail.com",
      password: "123457***",
      name: "test 1"
    });

    const res = await request(app).
      post("/api/auth/register")
      .send({
        username: "testUser",
        email: "test@gmail.com",
        password: "12345***",
        name: "test"
      });

    expect(res.body.message).toBe("User Already Exists");
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  })
});

describe("POST /api/auth/logout", () => {
  it("should logout user successfully and clear cookie", async () => {

    (jwt.verify as jest.Mock).mockReturnValue({ email: "test@gmail.com" });

    (userModel.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({
        email: "test@gmail.com",
        username: "testUser"
      })
    });

    const res = await request(app)
      .post("/api/auth/logout").
      set("Cookie", "token=fake_token");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Log out successfully");

    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain("token=");

  });
});

describe("GET /api/auth/me", () => {

  it("should return 401 if no token is provided", async () => {

    const res = await request(app)
      .get("/api/auth/me");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("No token");
  });

  it("should return 401 if user is not found", async () => {

    // mock jwt
    (jwt.verify as jest.Mock).mockReturnValue({ userId: "123" });

    // mock mongoose chain
    (userModel.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });

    const res = await request(app)
      .get("/api/auth/me")
      .set("Cookie", "token=fake_token")

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("User not found");
  });

  it("should return user details if token is valid", async () => {

    // mock jwt
    (jwt.verify as jest.Mock).mockReturnValue({ userId: "123" });

    // mock mongoose chain
    (userModel.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: "123",
        email: "test@gmail.com",
        username: "testUser"
      })
    });

    const res = await request(app)
      .get("/api/auth/me")
      .set("Cookie", "token=fake_token")

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe("test@gmail.com");
  });
});

