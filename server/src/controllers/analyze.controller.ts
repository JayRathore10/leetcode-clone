import { GoogleGenerativeAI } from "@google/generative-ai";
import { authRequest } from "../types/authRequest.type";
import { Response, NextFunction } from "express";
import { GEMINI_API_KEY } from "../configs/env.config";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY as string);

export const analyzeCode = async (req: authRequest, res: Response, next: NextFunction) => {
  try {
    const { code, problem, language } = req.body;

    if (!code || !problem || !language) {
      return res.status(400).json({
        success: false,
        messsage: "There is some field is missiing"
      })
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const prompt = `
      You are a senior competitive programmer.

      Analyze the following ${language} code.

      Problem:
      ${problem}

      Code:
      ${code}

      Give:
      1. Code Summary
      2. Time Complexity
      3. Space Complexity
      4. Bugs / Edge Cases
      5. Optimization Suggestions
      6. Will it pass constraints?

      Keep it concise and structured.
      `;

      const result = await model.generateContent(prompt);
      const response = result.response.text();

      return res.status(200).json({
        success : true   , 
        message : "Code analysis", 
        analysis : response 
      });

  } catch (error) {
    next(error);
  }
}