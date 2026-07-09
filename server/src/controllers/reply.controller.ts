import { Response, NextFunction } from "express";
import { authRequest } from "../types/authRequest.type";
import { replyModel } from "../models/reply.model";
import { discussionModel } from "../models/discussion.model";

export const createReply = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
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

    const discussion = await discussionModel.findById(discussionId);

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
      const parent = await replyModel.findById(parentReply);

      if (!parent) {
        return res.status(404).json({
          success: false,
          message: "Parent reply not found",
        });
      }
    }

    const reply = await replyModel.create({
      discussion: discussionId,
      author: req.user._id,
      content,
      parentReply: parentReply || null,
    });

    discussion.replyCount += 1;
    await discussion.save();

    return res.status(201).json({
      success: true,
      message: "Reply added successfully",
      reply,
    });
  } catch (err) {
    next(err);
  }
};

export const getRepliesByDiscussion = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { discussionId } = req.params;

    const replies = await replyModel
      .find({ discussion: discussionId })
      .populate("author", "username name profilePic")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      totalReplies: replies.length,
      replies,
    });
  } catch (err) {
    next(err);
  }
};

export const updateReply = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
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

    const reply = await replyModel.findById(replyId);

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

    await reply.save();

    return res.status(200).json({
      success: true,
      message: "Reply updated successfully",
      reply,
    });
  } catch (err) {
    next(err);
  }
};
  
export const deleteReply = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { replyId } = req.params;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const reply = await replyModel.findById(replyId);

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

    await reply.deleteOne();

    await discussionModel.findByIdAndUpdate(reply.discussion, {
      $inc: { replyCount: -1 },
    });

    return res.status(200).json({
      success: true,
      message: "Reply deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const toggleLikeReply = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { replyId } = req.params;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const reply = await replyModel.findById(replyId);

    if (!reply) {
      return res.status(404).json({
        success: false,
        message: "Reply not found",
      });
    }

    const userId = req.user._id.toString();

    const alreadyLiked = reply.likes.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {
      reply.likes = reply.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      reply.likes.push(req.user._id);
    }

    await reply.save();

    return res.status(200).json({
      success: true,
      message: alreadyLiked ? "Reply unliked" : "Reply liked",
      likes: reply.likes.length,
    });
  } catch (err) {
    next(err);
  }
};

export const reportReply = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { replyId } = req.params;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const reply = await replyModel.findById(replyId);

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

    await reply.save();

    return res.status(200).json({
      success: true,
      message: "Reply reported successfully",
    });
  } catch (err) {
    next(err);
  }
};

