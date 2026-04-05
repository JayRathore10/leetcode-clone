import { userModel } from "../models/user.model";
import app from "../app";
import request from "supertest";

jest.mock("../models/user.model");

describe("GET /test"  , ()=>{
  it("should return 200 for success run" , async()=>{ 
    const res = await request(app).
      get("/api/users/test");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Hello");
  });
});