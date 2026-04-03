import request from "supertest";
import app from "../app";

describe("GET /" , ()=>{
  it("should return Jexts message" , async()=>{
    const res = await  request(app).get("/");
    expect(res.status).toBe(200);

    expect(res.text).toBe("Hi, Jexts here!");
  })
})

describe("GET test/" , ()=>{
  it("should return Test message" , async()=>{
    const res = await request(app).get("/test");
    expect(res.status).toBe(200);

    expect(res.body.message).toBe("Test");
  });
});