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
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeCode = void 0;
const generative_ai_1 = require("@google/generative-ai");
const env_config_1 = require("../configs/env.config");
const genAI = new generative_ai_1.GoogleGenerativeAI(env_config_1.GEMINI_API_KEY);
const analyzeCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const { code, problem, language } = req.body;
        const model = genAI.getGenerativeModel({
            model: "models/gemini-1.5-flash-latest",
        });
        const result = yield model.generateContent({
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
        const text = (_e = (_d = (_c = (_b = (_a = result.response.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text;
        res.json({
            success: true,
            analysis: text,
        });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});
exports.analyzeCode = analyzeCode;
