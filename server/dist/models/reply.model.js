"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replyModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const replySchema = new mongoose_1.default.Schema({
    discussion: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Discussion",
        required: true,
        index: true,
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    content: {
        type: String,
        required: [true, "Reply content is required"],
        trim: true,
        minlength: [2, "Reply must be at least 2 characters"],
        maxlength: [2000, "Reply cannot exceed 2000 characters"],
    },
    likes: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    parentReply: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Reply",
        default: null,
        index: true,
    },
    edited: {
        type: Boolean,
        default: false,
    },
    reported: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// Indexes
replySchema.index({ discussion: 1, createdAt: 1 });
exports.replyModel = mongoose_1.default.model("Reply", replySchema);
