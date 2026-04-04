import request from "supertest";
import { userModel } from "../models/user.model";
import app from "../app";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

jest.mock("../models/user.model");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("POST /api/auth/login" , ()=>{
  it("should login successfully", async()=>{
    // mocking the DB using the jest mock 
    (userModel.findOne as jest.Mock).mockReturnValue({
      email : "test@gmail.com"  , 
      password : "hashedPassword", 
    });

    // mocking bcrypt.compare(passowrd , user.password) 
    (bcrypt.compare as jest.Mock).mockReturnValue(true);

    // mocking jwt token
    (jwt.sign as jest.Mock).mockReturnValue("fake_token");

    const res = await request(app).
      post("/api/auth/login").
      send({
        email : "test@gmail.com" , 
        password : "123456"
      })

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    
    // take out cookies from the header 
    const cookies = res.headers["set-cookie"];

    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain("token=fake_token");
  });
});