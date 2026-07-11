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
exports.getMyContests = exports.unregisterContest = exports.registerContest = exports.deleteContest = exports.updateContest = exports.getContestById = exports.getAllContests = exports.createContest = void 0;
const contest_model_1 = require("../models/contest.model");
// Create Contest
const createContest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, startTime, endTime, isPublic, problems, } = req.body;
        const duration = (new Date(endTime).getTime() - new Date(startTime).getTime()) /
            (1000 * 60);
        let status;
        const now = new Date();
        if (now < new Date(startTime)) {
            status = "Upcoming";
        }
        else if (now >= new Date(startTime) && now <= new Date(endTime)) {
            status = "Running";
        }
        else {
            status = "Ended";
        }
        const contest = yield contest_model_1.contestModel.create({
            title,
            description,
            startTime,
            endTime,
            duration,
            isPublic,
            createdBy: req.user._id,
            problems,
            participants: [],
            status,
        });
        return res.status(201).json({
            success: true,
            message: "Contest created successfully.",
            contest,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createContest = createContest;
// Get All Contests
const getAllContests = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contests = yield contest_model_1.contestModel
            .find()
            .populate("createdBy", "name username profilePic")
            .sort({ startTime: -1 });
        return res.status(200).json({
            success: true,
            contests,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllContests = getAllContests;
// Get Contest By Id
const getContestById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contestId } = req.params;
        const contest = yield contest_model_1.contestModel
            .findById(contestId)
            .populate("createdBy", "name username profilePic")
            .populate("problems")
            .populate("participants", "name username profilePic");
        if (!contest) {
            return res.status(404).json({
                success: false,
                message: "Contest not found.",
            });
        }
        return res.status(200).json({
            success: true,
            contest,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getContestById = getContestById;
// Update Contest
const updateContest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contestId } = req.params;
        const contest = yield contest_model_1.contestModel.findById(contestId);
        if (!contest) {
            return res.status(404).json({
                success: false,
                message: "Contest not found.",
            });
        }
        if (contest.startTime <= new Date()) {
            return res.status(400).json({
                success: false,
                message: "Contest has already started.",
            });
        }
        Object.assign(contest, req.body);
        // Convert to Date because req.body contains strings
        contest.startTime = new Date(contest.startTime);
        contest.endTime = new Date(contest.endTime);
        contest.duration =
            (contest.endTime.getTime() - contest.startTime.getTime()) /
                (1000 * 60);
        const now = new Date();
        if (now < contest.startTime) {
            contest.status = "Upcoming";
        }
        else if (now >= contest.startTime && now <= contest.endTime) {
            contest.status = "Running";
        }
        else {
            contest.status = "Ended";
        }
        yield contest.save();
        return res.status(200).json({
            success: true,
            message: "Contest updated successfully.",
            contest,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateContest = updateContest;
// Delete Contest
const deleteContest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contestId } = req.params;
        const contest = yield contest_model_1.contestModel.findById(contestId);
        if (!contest) {
            return res.status(404).json({
                success: false,
                message: "Contest not found.",
            });
        }
        yield contest.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Contest deleted successfully.",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteContest = deleteContest;
// Register For Contest
const registerContest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contestId } = req.params;
        const contest = yield contest_model_1.contestModel.findById(contestId);
        if (!contest) {
            return res.status(404).json({
                success: false,
                message: "Contest not found.",
            });
        }
        if (contest.status === "Ended") {
            return res.status(400).json({
                success: false,
                message: "Contest has already ended.",
            });
        }
        if (contest.participants.includes(req.user._id)) {
            return res.status(400).json({
                success: false,
                message: "You are already registered for this contest.",
            });
        }
        contest.participants.push(req.user._id);
        yield contest.save();
        return res.status(200).json({
            success: true,
            message: "Registered successfully.",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.registerContest = registerContest;
// Unregister From Contest
const unregisterContest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contestId } = req.params;
        const contest = yield contest_model_1.contestModel.findById(contestId);
        if (!contest) {
            return res.status(404).json({
                success: false,
                message: "Contest not found.",
            });
        }
        contest.participants = contest.participants.filter((id) => id.toString() !== req.user._id.toString());
        yield contest.save();
        return res.status(200).json({
            success: true,
            message: "Unregistered successfully.",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.unregisterContest = unregisterContest;
// Get My Registered Contests
const getMyContests = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contests = yield contest_model_1.contestModel
            .find({
            participants: req.user._id,
        })
            .populate("createdBy", "name username")
            .sort({ startTime: -1 });
        return res.status(200).json({
            success: true,
            contests,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getMyContests = getMyContests;
