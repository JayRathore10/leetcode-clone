import { Request, Response, NextFunction } from "express";
import { authRequest } from "../types/authRequest.type";
import { userModel } from "../models/user.model";
import { questionModel } from "../models/question.model";
import { contestModel } from "../models/contest.model";
import { submissionModel } from "../models/submission.model";
import { discussionModel } from "../models/discussion1.model";
import { replyModel } from "../models/reply.model";

// GET /api/admin/stats
export const getAdminStats = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const [
      totalUsers,
      totalProblems,
      totalContests,
      totalSubmissions,
      totalDiscussions,
      acceptedSubmissions,
    ] = await Promise.all([
      userModel.countDocuments(),
      questionModel.countDocuments(),
      contestModel.countDocuments(),
      submissionModel.countDocuments(),
      discussionModel.countDocuments(),
      submissionModel.countDocuments({ status: "Accepted" }),
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
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/submissions
export const getAllSubmissions = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status as string | undefined;
    const language = req.query.language as string | undefined;
    const search = req.query.search as string | undefined;

    const filter: Record<string, unknown> = {};
    if (status && status !== "All") filter.status = status;
    if (language && language !== "All") filter.language = language;

    // If search is provided, find matching question IDs by title
    if (search) {
      const matchingQuestions = await questionModel
        .find({ title: { $regex: search, $options: "i" } })
        .select("_id");
      filter.questionId = { $in: matchingQuestions.map((q) => q._id) };
    }

    const submissions = await submissionModel
      .find(filter)
      .populate("userId", "username name profilePic")
      .populate("questionId", "title difficulty")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await submissionModel.countDocuments(filter);

    return res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalSubmissions: total,
      submissions,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/reported-discussions
export const getReportedDiscussions = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const discussions = await discussionModel
      .find({ reported: true })
      .populate("author", "username name profilePic")
      .populate("reportedBy", "username name")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      total: discussions.length,
      discussions,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/reported-replies
export const getReportedReplies = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const replies = await replyModel
      .find({ reported: true })
      .populate("author", "username name profilePic")
      .populate("discussion", "title")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      total: replies.length,
      replies,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/discussions/:discussionId/pin
export const togglePinDiscussion = async (
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

    discussion.pinned = !discussion.pinned;
    await discussion.save();

    return res.status(200).json({
      success: true,
      message: discussion.pinned
        ? "Discussion pinned"
        : "Discussion unpinned",
      pinned: discussion.pinned,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/discussions/:discussionId/lock
export const toggleLockDiscussion = async (
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

    discussion.locked = !discussion.locked;
    await discussion.save();

    return res.status(200).json({
      success: true,
      message: discussion.locked
        ? "Discussion locked"
        : "Discussion unlocked",
      locked: discussion.locked,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/discussions/:discussionId
export const adminDeleteDiscussion = async (
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

    // Delete all replies associated with this discussion
    await replyModel.deleteMany({ discussion: discussionId });

    await discussion.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Discussion and its replies deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/replies/:replyId
export const adminDeleteReply = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { replyId } = req.params;

    const reply = await replyModel.findById(replyId);

    if (!reply) {
      return res.status(404).json({
        success: false,
        message: "Reply not found",
      });
    }

    await discussionModel.findByIdAndUpdate(reply.discussion, {
      $inc: { replyCount: -1 },
    });

    await reply.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Reply deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/discussions/:discussionId/resolve
export const resolveReportedDiscussion = async (
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

    discussion.reported = false;
    discussion.reportedBy = [];
    await discussion.save();

    return res.status(200).json({
      success: true,
      message: "Report resolved",
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/replies/:replyId/resolve
export const resolveReportedReply = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { replyId } = req.params;

    const reply = await replyModel.findById(replyId);

    if (!reply) {
      return res.status(404).json({
        success: false,
        message: "Reply not found",
      });
    }

    reply.reported = false;
    await reply.save();

    return res.status(200).json({
      success: true,
      message: "Report resolved",
    });
  } catch (error) {
    next(error);
  }
};
