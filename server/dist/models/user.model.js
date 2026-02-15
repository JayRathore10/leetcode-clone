"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchmea = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        minLength: 3,
        maxLength: 20,
        unique: true
    },
    name: {
        type: String,
        required: [true, "name is required"],
        minLength: 2,
        maxLength: 20
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: 6
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    profilePic: {
        type: String,
        default: "default.jpg"
    }
}, { timestamps: true });
exports.userModel = mongoose_1.default.model("User", userSchmea);
