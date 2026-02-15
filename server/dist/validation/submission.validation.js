"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submissionSchema = void 0;
const zod_1 = require("zod");
exports.submissionSchema = zod_1.z.object({
    questionId: zod_1.z.string(),
    code: zod_1.z.string(),
    language: zod_1.z.string(),
    status: zod_1.z.string(),
    title: zod_1.z.string()
});
