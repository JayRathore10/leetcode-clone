import { GoogleGenerativeAI } from "@google/generative-ai";
import { Response, NextFunction } from "express";
import { authRequest } from "../types/authRequest.type";
import { GEMINI_API_KEY } from "../configs/env.config";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);

export const analyzeCode = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code, problem, language } = req.body;

    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-flash-latest",
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
Analyze this ${language} code.

Problem:
${problem}

Code:
${code}
`,
            },
          ],
        },
      ],
    });

    const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text;

    res.json({
      success: true,
      analysis: text,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
