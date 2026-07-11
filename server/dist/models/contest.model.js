"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contestModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const contestSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: [true, "Contest title is required"],
        trim: true,
        minLength: 3,
        maxLength: 100,
    },
    description: {
        type: String,
        required: [true, "Contest description is required"],
        trim: true,
        maxLength: 1000,
    },
    startTime: {
        type: Date,
        required: [true, "Start time is required"],
    },
    endTime: {
        type: Date,
        required: [true, "End time is required"],
    },
    duration: {
        type: Number,
        required: [true, "Duration is required"],
        min: 1,
    },
    isPublic: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    problems: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Problem",
        },
    ],
    participants: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    status: {
        type: String,
        enum: ["Upcoming", "Running", "Ended"],
        default: "Upcoming",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
exports.contestModel = mongoose_1.default.model("Contest", contestSchema);
