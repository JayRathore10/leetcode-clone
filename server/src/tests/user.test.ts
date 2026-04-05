import { userModel } from "../models/user.model";
import app from "../app";
import request from "supertest";

jest.mock("../models/user.model");

describe("GET /api/users/test"  , ()=>{
  it("should return 200 for success run" , async()=>{ 
    const res = await request(app).
      get("/api/users/test");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Hello");
  });
});

describe("GET /api/users/all" , ()=>{
  it("should return 404 when there is no user in database"  , async()=>{
    (userModel.find as jest.Mock).mockResolvedValue ([]);

    const res = await request(app).
      get("/api/users/all");

    expect(res.status).toBe(404);
  })

  it("should return 200 when successfully return all users in database" , async()=>{

    (userModel.find as jest.Mock).mockResolvedValue(["user"]);

    const res = await request(app).
      get("/api/users/all");

    expect(res.status).toBe(200);

  })

});

// describe("GET /api/users/profile" , ()=>{
//   it("should return ")
// })