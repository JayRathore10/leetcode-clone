"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const createTestCaseSchema = zod_1.z.array(zod_1.z.object({
    questionId: zod_1.z.string(),
    input: zod_1.z.string(),
    output: zod_1.z.string(),
    isHidden: zod_1.z.boolean().optional()
}));
exports.default = createTestCaseSchema;
