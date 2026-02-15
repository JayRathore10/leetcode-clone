"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const questionSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: [true, "Question title is needed"],
    },
    description: {
        type: String,
        required: [true, "Question description is needed"]
    },
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"]
    },
    tags: {
        type: [String],
        default: []
    },
    constraints: {
        type: [String]
    },
    example: {
        input: String,
        output: String,
        explanation: String
    }
}, { timestamps: true });
exports.questionModel = mongoose_1.default.model("Question", questionSchema);
