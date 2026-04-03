import request from "supertest";
import app from "../app";

describe("GET test/" , ()=>{
  it("should return Test message" , async()=>{
    const res = await request(app).get("/test");
    expect(res.status).toBe(200);

    expect(res.body.message).toBe("Test");
  });
});