import {Router} from "express";
import { addSubmission, userAllSubmission } from "../controllers/submission.controller";
import { mockAuth } from "../middleware/mock.middleware";
import { isUserLoggedIn } from "../middleware/auth.middleware";

export const submissionRouter = Router();

// User protected route 
submissionRouter.post("/" , isUserLoggedIn , addSubmission);
submissionRouter.get("/" , isUserLoggedIn , userAllSubmission);