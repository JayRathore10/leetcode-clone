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
exports.resolveReportedReply = exports.resolveReportedDiscussion = exports.adminDeleteReply = exports.adminDeleteDiscussion = exports.toggleLockDiscussion = exports.togglePinDiscussion = exports.getReportedReplies = exports.getReportedDiscussions = exports.getAllSubmissions = exports.getAdminStats = void 0;
const user_model_1 = require("../models/user.model");
const question_model_1 = require("../models/question.model");
const contest_model_1 = require("../models/contest.model");
const submission_model_1 = require("../models/submission.model");
const discussion1_model_1 = require("../models/discussion1.model");
const reply_model_1 = require("../models/reply.model");
// GET /api/admin/stats
const getAdminStats = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [totalUsers, totalProblems, totalContests, totalSubmissions, totalDiscussions, acceptedSubmissions,] = yield Promise.all([
            user_model_1.userModel.countDocuments(),
            question_model_1.questionModel.countDocuments(),
            contest_model_1.contestModel.countDocuments(),
            submission_model_1.submissionModel.countDocuments(),
            discussion1_model_1.discussionModel.countDocuments(),
            submission_model_1.submissionModel.countDocuments({ status: "Accepted" }),
        ]);
        return res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalProblems,
                totalContests,
                totalSubmissions,
                totalDiscussions,
                acceptedSubmissions,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAdminStats = getAdminStats;
// GET /api/admin/submissions
const getAllSubmissions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const status = req.query.status;
        const language = req.query.language;
        const search = req.query.search;
        const filter = {};
        if (status && status !== "All")
            filter.status = status;
        if (language && language !== "All")
            filter.language = language;
        // If search is provided, find matching question IDs by title
        if (search) {
            const matchingQuestions = yield question_model_1.questionModel
                .find({ title: { $regex: search, $options: "i" } })
                .select("_id");
            filter.questionId = { $in: matchingQuestions.map((q) => q._id) };
        }
        const submissions = yield submission_model_1.submissionModel
            .find(filter)
            .populate("userId", "username name profilePic")
            .populate("questionId", "title difficulty")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        const total = yield submission_model_1.submissionModel.countDocuments(filter);
        return res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalSubmissions: total,
            submissions,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllSubmissions = getAllSubmissions;
// GET /api/admin/reported-discussions
const getReportedDiscussions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const discussions = yield discussion1_model_1.discussionModel
            .find({ reported: true })
            .populate("author", "username name profilePic")
            .populate("reportedBy", "username name")
            .sort({ updatedAt: -1 });
        return res.status(200).json({
            success: true,
            total: discussions.length,
            discussions,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getReportedDiscussions = getReportedDiscussions;
// GET /api/admin/reported-replies
const getReportedReplies = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const replies = yield reply_model_1.replyModel
            .find({ reported: true })
            .populate("author", "username name profilePic")
            .populate("discussion", "title")
            .sort({ updatedAt: -1 });
        return res.status(200).json({
            success: true,
            total: replies.length,
            replies,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getReportedReplies = getReportedReplies;
// PUT /api/admin/discussions/:discussionId/pin
const togglePinDiscussion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { discussionId } = req.params;
        const discussion = yield discussion1_model_1.discussionModel.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({
                success: false,
                message: "Discussion not found",
            });
        }
        discussion.pinned = !discussion.pinned;
        yield discussion.save();
        return res.status(200).json({
            success: true,
            message: discussion.pinned
                ? "Discussion pinned"
                : "Discussion unpinned",
            pinned: discussion.pinned,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.togglePinDiscussion = togglePinDiscussion;
// PUT /api/admin/discussions/:discussionId/lock
const toggleLockDiscussion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { discussionId } = req.params;
        const discussion = yield discussion1_model_1.discussionModel.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({
                success: false,
                message: "Discussion not found",
            });
        }
        discussion.locked = !discussion.locked;
        yield discussion.save();
        return res.status(200).json({
            success: true,
            message: discussion.locked
                ? "Discussion locked"
                : "Discussion unlocked",
            locked: discussion.locked,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.toggleLockDiscussion = toggleLockDiscussion;
// DELETE /api/admin/discussions/:discussionId
const adminDeleteDiscussion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { discussionId } = req.params;
        const discussion = yield discussion1_model_1.discussionModel.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({
                success: false,
                message: "Discussion not found",
            });
        }
        // Delete all replies associated with this discussion
        yield reply_model_1.replyModel.deleteMany({ discussion: discussionId });
        yield discussion.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Discussion and its replies deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.adminDeleteDiscussion = adminDeleteDiscussion;
// DELETE /api/admin/replies/:replyId
const adminDeleteReply = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { replyId } = req.params;
        const reply = yield reply_model_1.replyModel.findById(replyId);
        if (!reply) {
            return res.status(404).json({
                success: false,
                message: "Reply not found",
            });
        }
        yield discussion1_model_1.discussionModel.findByIdAndUpdate(reply.discussion, {
            $inc: { replyCount: -1 },
        });
        yield reply.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Reply deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.adminDeleteReply = adminDeleteReply;
// PUT /api/admin/discussions/:discussionId/resolve
const resolveReportedDiscussion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { discussionId } = req.params;
        const discussion = yield discussion1_model_1.discussionModel.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({
                success: false,
                message: "Discussion not found",
            });
        }
        discussion.reported = false;
        discussion.reportedBy = [];
        yield discussion.save();
        return res.status(200).json({
            success: true,
            message: "Report resolved",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.resolveReportedDiscussion = resolveReportedDiscussion;
// PUT /api/admin/replies/:replyId/resolve
const resolveReportedReply = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { replyId } = req.params;
        const reply = yield reply_model_1.replyModel.findById(replyId);
        if (!reply) {
            return res.status(404).json({
                success: false,
                message: "Reply not found",
            });
        }
        reply.reported = false;
        yield reply.save();
        return res.status(200).json({
            success: true,
            message: "Report resolved",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.resolveReportedReply = resolveReportedReply;
