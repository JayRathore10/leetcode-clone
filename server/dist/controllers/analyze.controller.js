"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeCode = void 0;
const axios_1 = __importDefault(require("axios"));
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not defined");
}
const analyzeCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
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
        const response = yield axios_1.default.post("https://openrouter.ai/api/v1/chat/completions", {
            model: "google/gemma-3n-e2b-it:free",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        }, {
            headers: {
                Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000", // optional but recommended
                "X-Title": "Code Analyzer App", // optional
            },
        });
        const text = ((_d = (_c = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.choices) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content) ||
            "No analysis generated.";
        return res.status(200).json({
            success: true,
            analysis: text,
        });
    }
    catch (error) {
        console.error("OpenRouter Error:", ((_e = error.response) === null || _e === void 0 ? void 0 : _e.data) || error.message);
        return res.status(500).json({
            success: false,
            error: ((_f = error.response) === null || _f === void 0 ? void 0 : _f.data) || error.message,
        });
    }
});
exports.analyzeCode = analyzeCode;
