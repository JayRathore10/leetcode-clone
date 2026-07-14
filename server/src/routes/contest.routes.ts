import { Router } from "express";
import {
  createContest,
  deleteContest,
  getAllContests,
  getContestById,
  getMyContests,
  registerContest,
  unregisterContest,
  updateContest,
} from "../controllers/contest.controller";
import { isUserLoggedIn } from "../middleware/auth.middleware";

export const contestRouter = Router();

contestRouter.get("/", getAllContests);
contestRouter.get("/my/registered", isUserLoggedIn, getMyContests);

// User Protected Routes
contestRouter.get("/:contestId", getContestById);
contestRouter.post("/:contestId/register", isUserLoggedIn, registerContest);
contestRouter.delete("/:contestId/unregister", isUserLoggedIn, unregisterContest);

// Admin Protected Routes
// (Replace isUserLoggedIn with isAdmin middleware when you create one)
contestRouter.post("/", isUserLoggedIn, createContest);
contestRouter.put("/:contestId", isUserLoggedIn, updateContest);
contestRouter.delete("/:contestId", isUserLoggedIn, deleteContest);