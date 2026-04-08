import request from "supertest";
import app from "../app";
import { questionModel } from "../models/question.model";
import { isUserLoggedIn } from "../middleware/auth.middleware";

jest.mock("../models/question.model.ts");
jest.mock("../middleware/auth.middleware", () => ({
  isUserLoggedIn: jest.fn()
}));

describe("DELETE /api/question/delete/:questionId", () => {
  it("should return 404 when question not found in database for deletion", async () => {
    (questionModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

    const res = await request(app).
      delete("/api/question/delete/1234");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      message: "Question Not found"
    });
  });

  it("should return 200 when it successfully delete question", async () => {
    (questionModel.findByIdAndDelete as jest.Mock).mockResolvedValue({
      _id: "1234"
    });

    const res = await request(app).
      delete("/api/question/delete/1234");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "Question delete successfully"
    });

  });
})