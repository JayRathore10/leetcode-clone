"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
exports.adminRouter = (0, express_1.Router)();
// All routes are admin-protected
exports.adminRouter.use(auth_middleware_1.isAdminLoggedIn);
// Dashboard stats
exports.adminRouter.get("/stats", admin_controller_1.getAdminStats);
// Submissions management
exports.adminRouter.get("/submissions", admin_controller_1.getAllSubmissions);
// Reported content
exports.adminRouter.get("/reported-discussions", admin_controller_1.getReportedDiscussions);
exports.adminRouter.get("/reported-replies", admin_controller_1.getReportedReplies);
// Discussion moderation
exports.adminRouter.put("/discussions/:discussionId/pin", admin_controller_1.togglePinDiscussion);
exports.adminRouter.put("/discussions/:discussionId/lock", admin_controller_1.toggleLockDiscussion);
exports.adminRouter.delete("/discussions/:discussionId", admin_controller_1.adminDeleteDiscussion);
exports.adminRouter.put("/discussions/:discussionId/resolve", admin_controller_1.resolveReportedDiscussion);
// Reply moderation
exports.adminRouter.delete("/replies/:replyId", admin_controller_1.adminDeleteReply);
exports.adminRouter.put("/replies/:replyId/resolve", admin_controller_1.resolveReportedReply);
