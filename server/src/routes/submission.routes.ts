import {Router} from "express";
import { addSubmission } from "../controllers/submission.controller";
import { isUserLoggedIn } from "../middleware/auth.middleware";

export const submissionRouter = Router();

// User protected route 
submissionRouter.post("/" , isUserLoggedIn , addSubmission);