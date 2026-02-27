import axios from "axios";
import { Response, NextFunction } from "express";
import { authRequest } from "../types/authRequest.type";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY is not defined");
}

export const analyzeCode = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code, problem, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        error: "Code and language are required",
      });
    }

    const prompt = `
You are a senior software engineer.

Analyze the following ${language} code.

Problem Description:
${problem || "Not provided"}

Code:
${code}

Provide:
1. What the code does
2. Time & Space Complexity
3. Possible bugs (if any)
4. Optimization suggestions
5. Code quality feedback
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemma-3n-e2b-it:free",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", // optional but recommended
          "X-Title": "Code Analyzer App", // optional
        },
      }
    );

    const text =
      response.data?.choices?.[0]?.message?.content ||
      "No analysis generated.";

    return res.status(200).json({
      success: true,
      analysis: text,
    });
  } catch (error: any) {
    console.error("OpenRouter Error:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
};