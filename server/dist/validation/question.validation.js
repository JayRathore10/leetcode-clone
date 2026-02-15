"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionSchema = void 0;
const zod_1 = require("zod");
exports.questionSchema = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    difficulty: zod_1.z.enum(["Easy", "Medium", "Hard"]),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    constraints: zod_1.z.array(zod_1.z.string()),
    example: zod_1.z.object({
        input: zod_1.z.string(),
        output: zod_1.z.string(),
        explanation: zod_1.z.string()
    })
});
