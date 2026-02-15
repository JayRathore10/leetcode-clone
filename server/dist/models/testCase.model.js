"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testCaseModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
;
const testCaseSchema = new mongoose_1.default.Schema({
    questionId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "Question"
    },
    input: {
        type: String,
        required: true,
    },
    output: {
        type: String,
        required: true,
    },
    isHidden: {
        type: Boolean,
        default: false
    }
});
exports.testCaseModel = mongoose_1.default.model("TestCase", testCaseSchema);
