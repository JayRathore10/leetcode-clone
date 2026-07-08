import { Response, NextFunction } from "express";
import { discussionModel } from "../models/discussion.model";
import { authRequest } from "../types/authRequest.type";

export const createDiscussion = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
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

    const discussion = await discussionModel.create({
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
  } catch (err) {
    next(err);
  }
};

export const getAllDiscussions = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const discussions = await discussionModel
      .find()
      .populate("author", "username name profilePic")
      .sort({ pinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await discussionModel.countDocuments();

    return res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalDiscussions: total,
      discussions,
    });
  } catch (err) {
    next(err);
  }
};

export const getDiscussionById = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { discussionId } = req.params;

    const discussion = await discussionModel
      .findByIdAndUpdate(
        discussionId,
        { $inc: { views: 1 } },
        { new: true }
      )
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
  } catch (err) {
    next(err);
  }
};

export const searchDiscussions = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const search = req.query.q as string;

    if (!search) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const discussions = await discussionModel
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
  } catch (err) {
    next(err);
  }
};

export const updateDiscussion = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { discussionId } = req.params;
    const { title, content, category, tags } = req.body;

    const discussion = await discussionModel.findById(discussionId);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }

    if (discussion.author.toString() !== req.user?._id.toString()) {
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

    await discussion.save();

    return res.status(200).json({
      success: true,
      message: "Discussion updated successfully",
      discussion,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteDiscussion = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { discussionId } = req.params;

    const discussion = await discussionModel.findById(discussionId);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }

    if (discussion.author.toString() !== req.user?._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this discussion",
      });
    }

    await discussion.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Discussion deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const toggleLikeDiscussion = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { discussionId } = req.params;

    const discussion = await discussionModel.findById(discussionId);

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

    const alreadyLiked = discussion.likes.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {
      discussion.likes = discussion.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      discussion.likes.push(req.user._id);
    }

    await discussion.save();

    return res.status(200).json({
      success: true,
      message: alreadyLiked
        ? "Discussion unliked"
        : "Discussion liked",
      likes: discussion.likes.length,
    });
  } catch (err) {
    next(err);
  }
};

export const toggleBookmarkDiscussion = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { discussionId } = req.params;

    const discussion = await discussionModel.findById(discussionId);

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

    const userId = req.user?._id.toString();

    const alreadyBookmarked = discussion.bookmarks.some(
      (id) => id.toString() === userId
    );

    if (alreadyBookmarked) {
      discussion.bookmarks = discussion.bookmarks.filter(
        (id) => id.toString() !== userId
      );
    } else {
      discussion.bookmarks.push(req.user._id);
    }

    await discussion.save();

    return res.status(200).json({
      success: true,
      message: alreadyBookmarked
        ? "Bookmark removed"
        : "Discussion bookmarked",
      bookmarks: discussion.bookmarks.length,
    });
  } catch (err) {
    next(err);
  }
};

export const reportDiscussion = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { discussionId } = req.params;

    const discussion = await discussionModel.findById(discussionId);

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

    const userId = req.user?._id.toString();

    const alreadyReported = discussion.reportedBy.some(
      (id) => id.toString() === userId
    );

    if (alreadyReported) {
      return res.status(400).json({
        success: false,
        message: "You have already reported this discussion",
      });
    }

    discussion.reported = true;
    discussion.reportedBy.push(req.user._id);

    await discussion.save();

    return res.status(200).json({
      success: true,
      message: "Discussion reported successfully",
    });
  } catch (err) {
    next(err);
  }
};