import { Router } from "express";
import {
  createReply,
  deleteReply,
  getRepliesByDiscussion,
  reportReply,
  toggleLikeReply,
  updateReply,
} from "../controllers/reply.controller";
import { isUserLoggedIn } from "../middleware/auth.middleware";

export const replyRouter = Router();

replyRouter.get("/discussion/:discussionId", getRepliesByDiscussion);

replyRouter.post("/", isUserLoggedIn, createReply);

replyRouter.put("/:replyId", isUserLoggedIn, updateReply);

replyRouter.delete("/:replyId", isUserLoggedIn, deleteReply);

replyRouter.post("/:replyId/like", isUserLoggedIn, toggleLikeReply);

replyRouter.post("/:replyId/report", isUserLoggedIn, reportReply);