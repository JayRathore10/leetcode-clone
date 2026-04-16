import request from "supertest";
import app from "../app";
import axios from "axios";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("POST /api/analyze", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 when code or language is missing", async () => {
    const res = await request(app)
      .post("/api/analyze")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      success: false,
      error: "Code and language are required"
    });
  });

  it("should return 200 with analysis", async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        choices: [
          {
            message: {
              content: "This code adds two numbers."
            }
          }
        ]
      }
    } as any);

    const res = await request(app)
      .post("/api/analyze")
      .send({
        code: "int main(){ return 0; }",
        language: "cpp",
        problem: "Dummy problem"
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      analysis: "This code adds two numbers."
    });
  });

  it("should handle empty AI response", async () => {
    mockedAxios.post.mockResolvedValue({
      data: {}
    } as any);

    const res = await request(app)
      .post("/api/analyze")
      .send({
        code: "int main(){ return 0; }",
        language: "cpp"
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      analysis: "No analysis generated."
    });
  });

  it("should return 500 when axios fails", async () => {
    mockedAxios.post.mockRejectedValue({
      response: {
        data: "API Error"
      }
    });

    const res = await request(app)
      .post("/api/analyze")
      .send({
        code: "int main(){ return 0; }",
        language: "cpp"
      });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      success: false,
      error: "API Error"
    });
  });

});

// task for tommorow 