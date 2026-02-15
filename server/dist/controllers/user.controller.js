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
exports.editProfile = exports.getUserProfile = exports.getAllSubmission = exports.getByUsername = exports.getAllUsers = exports.test = void 0;
const user_model_1 = require("../models/user.model");
const submission_model_1 = require("../models/submission.model");
const test = (req, res, next) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Hello"
        });
    }
    catch (err) {
        next(err);
    }
};
exports.test = test;
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.userModel.find();
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No User found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "All Users",
            data: {
                users
            }
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getAllUsers = getAllUsers;
const getByUsername = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.params;
        if (!username) {
            return res.status(404).json({
                success: false,
                message: "Wrong route"
            });
        }
        const user = yield user_model_1.userModel.findOne({ username: username }).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "User Details",
            user
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getByUsername = getByUsername;
const getAllSubmission = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.params.username;
        const user = yield user_model_1.userModel.findOne({ username });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const submissions = yield submission_model_1.submissionModel.find({ userId: user._id }).sort({ createdAt: -1 });
        if (submissions.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No Submission found",
                submissions: []
            });
        }
        return res.status(200).json({
            success: true,
            message: "All Submissions",
            data: {
                submissions
            }
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getAllSubmission = getAllSubmission;
const getUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.user) {
            return res.status(400).json({
                success: false,
                message: "Error in getting user detail"
            });
        }
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const user = yield user_model_1.userModel.findById({ userId }).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "User Data",
            user
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getUserProfile = getUserProfile;
const editProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name } = req.body;
        if (!req.user) {
            return res.status(400).json({
                message: "Can not find Error",
                success: false
            });
        }
        if (name)
            req.user.name = name;
        if (req.file)
            req.user.profilePic = req.file.filename;
        yield ((_a = req.user) === null || _a === void 0 ? void 0 : _a.save());
        return res.status(200).json({
            success: true,
            message: "Profile Updated"
        });
    }
    catch (error) {
        next(error);
    }
});
exports.editProfile = editProfile;
