"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.discussionModel = exports.CATEGORIES = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.CATEGORIES = [
    "General",
    "Problem",
    "Interview",
    "Contest",
    "Learning",
    "Career",
];
const discussionSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        minlength: [5, "Title must be at least 5 characters"],
        maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
        type: String,
        required: [true, "Content is required"],
        trim: true,
        minlength: [10, "Content must be at least 10 characters"],
        maxlength: [5000, "Content cannot exceed 5000 characters"],
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    category: {
        type: String,
        enum: exports.CATEGORIES,
        required: [true, "Category is required"],
        default: "General",
        index: true,
    },
    tags: {
        type: [String],
        default: [],
        validate: {
            validator: (tags) => tags.length <= 5,
            message: "Maximum 5 tags allowed",
        },
    },
    likes: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    bookmarks: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    views: {
        type: Number,
        default: 0,
        min: 0,
    },
    replyCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    pinned: {
        type: Boolean,
        default: false,
    },
    locked: {
        type: Boolean,
        default: false,
    },
    reported: {
        type: Boolean,
        default: false,
    },
    reportedBy: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
}, {
    timestamps: true,
});
// Indexes
discussionSchema.index({ createdAt: -1 });
discussionSchema.index({ pinned: -1, createdAt: -1 });
discussionSchema.index({
    title: "text",
    content: "text",
    tags: "text",
});
exports.discussionModel = mongoose_1.default.model("Discussion", discussionSchema);
