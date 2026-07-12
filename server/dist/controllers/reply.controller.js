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
exports.reportReply = exports.toggleLikeReply = exports.deleteReply = exports.updateReply = exports.getRepliesByDiscussion = exports.createReply = void 0;
const reply_model_1 = require("../models/reply.model");
const discussion1_model_1 = require("../models/discussion1.model");
const createReply = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { discussionId, content, parentReply } = req.body;
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        if (!discussionId || !content) {
            return res.status(400).json({
                success: false,
                message: "Discussion Id and content are required",
            });
        }
        const discussion = yield discussion1_model_1.discussionModel.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({
                success: false,
                message: "Discussion not found",
            });
        }
        if (discussion.locked) {
            return res.status(400).json({
                success: false,
                message: "This discussion is locked",
            });
        }
        if (parentReply) {
            const parent = yield reply_model_1.replyModel.findById(parentReply);
            if (!parent) {
                return res.status(404).json({
                    success: false,
                    message: "Parent reply not found",
                });
            }
        }
        const reply = yield reply_model_1.replyModel.create({
            discussion: discussionId,
            author: req.user._id,
            content,
            parentReply: parentReply || null,
        });
        discussion.replyCount += 1;
        yield discussion.save();
        return res.status(201).json({
            success: true,
            message: "Reply added successfully",
            reply,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createReply = createReply;
const getRepliesByDiscussion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { discussionId } = req.params;
        const replies = yield reply_model_1.replyModel
            .find({ discussion: discussionId })
            .populate("author", "username name profilePic")
            .sort({ createdAt: 1 });
        return res.status(200).json({
            success: true,
            totalReplies: replies.length,
            replies,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getRepliesByDiscussion = getRepliesByDiscussion;
const updateReply = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { replyId } = req.params;
        const { content } = req.body;
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Content is required",
            });
        }
        const reply = yield reply_model_1.replyModel.findById(replyId);
        if (!reply) {
            return res.status(404).json({
                success: false,
                message: "Reply not found",
            });
        }
        if (reply.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this reply",
            });
        }
        reply.content = content;
        reply.edited = true;
        yield reply.save();
        return res.status(200).json({
            success: true,
            message: "Reply updated successfully",
            reply,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateReply = updateReply;
const deleteReply = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { replyId } = req.params;
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const reply = yield reply_model_1.replyModel.findById(replyId);
        if (!reply) {
            return res.status(404).json({
                success: false,
                message: "Reply not found",
            });
        }
        if (reply.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this reply",
            });
        }
        yield reply.deleteOne();
        yield discussion1_model_1.discussionModel.findByIdAndUpdate(reply.discussion, {
            $inc: { replyCount: -1 },
        });
        return res.status(200).json({
            success: true,
            message: "Reply deleted successfully",
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteReply = deleteReply;
const toggleLikeReply = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { replyId } = req.params;
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const reply = yield reply_model_1.replyModel.findById(replyId);
        if (!reply) {
            return res.status(404).json({
                success: false,
                message: "Reply not found",
            });
        }
        const userId = req.user._id.toString();
        const alreadyLiked = reply.likes.some((id) => id.toString() === userId);
        if (alreadyLiked) {
            reply.likes = reply.likes.filter((id) => id.toString() !== userId);
        }
        else {
            reply.likes.push(req.user._id);
        }
        yield reply.save();
        return res.status(200).json({
            success: true,
            message: alreadyLiked ? "Reply unliked" : "Reply liked",
            likes: reply.likes.length,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.toggleLikeReply = toggleLikeReply;
const reportReply = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { replyId } = req.params;
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const reply = yield reply_model_1.replyModel.findById(replyId);
        if (!reply) {
            return res.status(404).json({
                success: false,
                message: "Reply not found",
            });
        }
        if (reply.reported) {
            return res.status(400).json({
                success: false,
                message: "Reply has already been reported",
            });
        }
        reply.reported = true;
        yield reply.save();
        return res.status(200).json({
            success: true,
            message: "Reply reported successfully",
        });
    }
    catch (err) {
        next(err);
    }
});
exports.reportReply = reportReply;
