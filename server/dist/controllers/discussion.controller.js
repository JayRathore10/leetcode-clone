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
exports.reportDiscussion = exports.toggleBookmarkDiscussion = exports.toggleLikeDiscussion = exports.deleteDiscussion = exports.updateDiscussion = exports.searchDiscussions = exports.getDiscussionById = exports.getAllDiscussions = exports.createDiscussion = void 0;
const discussion1_model_1 = require("../models/discussion1.model");
const createDiscussion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, category, tags } = req.body;
        if (!title || !content || !category) {
            return res.status(400).json({
                success: false,
                message: "Title, content and category are required",
            });
        }
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const discussion = yield discussion1_model_1.discussionModel.create({
            title,
            content,
            category,
            tags: tags || [],
            author: req.user._id,
        });
        return res.status(201).json({
            success: true,
            message: "Discussion created successfully",
            discussion,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createDiscussion = createDiscussion;
const getAllDiscussions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const category = req.query.category;
        const filter = {};
        if (category && category !== "All") {
            filter.category = category;
        }
        const discussions = yield discussion1_model_1.discussionModel
            .find(filter)
            .populate("author", "username name profilePic")
            .sort({ pinned: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = yield discussion1_model_1.discussionModel.countDocuments(filter);
        return res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalDiscussions: total,
            discussions,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getAllDiscussions = getAllDiscussions;
const getDiscussionById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { discussionId } = req.params;
        const discussion = yield discussion1_model_1.discussionModel
            .findByIdAndUpdate(discussionId, { $inc: { views: 1 } }, { new: true })
            .populate("author", "username name profilePic");
        if (!discussion) {
            return res.status(404).json({
                success: false,
                message: "Discussion not found",
            });
        }
        return res.status(200).json({
            success: true,
            discussion,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getDiscussionById = getDiscussionById;
const searchDiscussions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const search = req.query.q;
        if (!search) {
            return res.status(400).json({
                success: false,
                message: "Search query is required",
            });
        }
        const discussions = yield discussion1_model_1.discussionModel
            .find({
            $text: {
                $search: search,
            },
        })
            .populate("author", "username name profilePic")
            .sort({
            score: {
                $meta: "textScore",
            },
        });
        return res.status(200).json({
            success: true,
            total: discussions.length,
            discussions,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.searchDiscussions = searchDiscussions;
const updateDiscussion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { discussionId } = req.params;
        const { title, content, category, tags } = req.body;
        const discussion = yield discussion1_model_1.discussionModel.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({
                success: false,
                message: "Discussion not found",
            });
        }
        if (discussion.author.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString())) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to edit this discussion",
            });
        }
        if (discussion.locked) {
            return res.status(400).json({
                success: false,
                message: "This discussion is locked",
            });
        }
        discussion.title = title || discussion.title;
        discussion.content = content || discussion.content;
        discussion.category = category || discussion.category;
        discussion.tags = tags || discussion.tags;
        yield discussion.save();
        return res.status(200).json({
            success: true,
            message: "Discussion updated successfully",
            discussion,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateDiscussion = updateDiscussion;
const deleteDiscussion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { discussionId } = req.params;
        const discussion = yield discussion1_model_1.discussionModel.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({
                success: false,
                message: "Discussion not found",
            });
        }
        if (discussion.author.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString())) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this discussion",
            });
        }
        yield discussion.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Discussion deleted successfully",
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteDiscussion = deleteDiscussion;
const toggleLikeDiscussion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { discussionId } = req.params;
        const discussion = yield discussion1_model_1.discussionModel.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({
                success: false,
                message: "Discussion not found",
            });
        }
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const userId = req.user._id.toString();
        const alreadyLiked = discussion.likes.some((id) => id.toString() === userId);
        if (alreadyLiked) {
            discussion.likes = discussion.likes.filter((id) => id.toString() !== userId);
        }
        else {
            discussion.likes.push(req.user._id);
        }
        yield discussion.save();
        return res.status(200).json({
            success: true,
            message: alreadyLiked
                ? "Discussion unliked"
                : "Discussion liked",
            likes: discussion.likes.length,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.toggleLikeDiscussion = toggleLikeDiscussion;
const toggleBookmarkDiscussion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { discussionId } = req.params;
        const discussion = yield discussion1_model_1.discussionModel.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({
                success: false,
                message: "Discussion not found",
            });
        }
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString();
        const alreadyBookmarked = discussion.bookmarks.some((id) => id.toString() === userId);
        if (alreadyBookmarked) {
            discussion.bookmarks = discussion.bookmarks.filter((id) => id.toString() !== userId);
        }
        else {
            discussion.bookmarks.push(req.user._id);
        }
        yield discussion.save();
        return res.status(200).json({
            success: true,
            message: alreadyBookmarked
                ? "Bookmark removed"
                : "Discussion bookmarked",
            bookmarks: discussion.bookmarks.length,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.toggleBookmarkDiscussion = toggleBookmarkDiscussion;
const reportDiscussion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { discussionId } = req.params;
        const discussion = yield discussion1_model_1.discussionModel.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({
                success: false,
                message: "Discussion not found",
            });
        }
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString();
        const alreadyReported = discussion.reportedBy.some((id) => id.toString() === userId);
        if (alreadyReported) {
            return res.status(400).json({
                success: false,
                message: "You have already reported this discussion",
            });
        }
        discussion.reported = true;
        discussion.reportedBy.push(req.user._id);
        yield discussion.save();
        return res.status(200).json({
            success: true,
            message: "Discussion reported successfully",
        });
    }
    catch (err) {
        next(err);
    }
});
exports.reportDiscussion = reportDiscussion;
