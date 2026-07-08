import { Router } from "express";
import {
  createDiscussion,
  deleteDiscussion,
  getAllDiscussions,
  getDiscussionById,
  reportDiscussion,
  searchDiscussions,
  toggleBookmarkDiscussion,
  toggleLikeDiscussion,
  updateDiscussion,
} from "../controllers/discussion.controller";
import { isUserLoggedIn } from "../middleware/auth.middleware";

export const discussionRouter = Router();

discussionRouter.get("/", getAllDiscussions);
discussionRouter.get("/search", searchDiscussions);
discussionRouter.get("/:discussionId", getDiscussionById);

discussionRouter.post("/", isUserLoggedIn, createDiscussion);
discussionRouter.put("/:discussionId", isUserLoggedIn, updateDiscussion);
discussionRouter.delete("/:discussionId", isUserLoggedIn, deleteDiscussion);

discussionRouter.post("/:discussionId/like", isUserLoggedIn, toggleLikeDiscussion);
discussionRouter.post("/:discussionId/bookmark", isUserLoggedIn, toggleBookmarkDiscussion);
discussionRouter.post("/:discussionId/report", isUserLoggedIn, reportDiscussion);