import { Router } from "express";
import {
  getAdminStats,
  getAllSubmissions,
  getReportedDiscussions,
  getReportedReplies,
  togglePinDiscussion,
  toggleLockDiscussion,
  adminDeleteDiscussion,
  adminDeleteReply,
  resolveReportedDiscussion,
  resolveReportedReply,
} from "../controllers/admin.controller";
import { isAdminLoggedIn } from "../middleware/auth.middleware";

export const adminRouter = Router();

// All routes are admin-protected
adminRouter.use(isAdminLoggedIn);

// Dashboard stats
adminRouter.get("/stats", getAdminStats);

// Submissions management
adminRouter.get("/submissions", getAllSubmissions);

// Reported content
adminRouter.get("/reported-discussions", getReportedDiscussions);
adminRouter.get("/reported-replies", getReportedReplies);

// Discussion moderation
adminRouter.put("/discussions/:discussionId/pin", togglePinDiscussion);
adminRouter.put("/discussions/:discussionId/lock", toggleLockDiscussion);
adminRouter.delete("/discussions/:discussionId", adminDeleteDiscussion);
adminRouter.put("/discussions/:discussionId/resolve", resolveReportedDiscussion);

// Reply moderation
adminRouter.delete("/replies/:replyId", adminDeleteReply);
adminRouter.put("/replies/:replyId/resolve", resolveReportedReply);
