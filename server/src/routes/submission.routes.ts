import {Router} from "express";
import { addSubmission } from "../controllers/submission.controller";
import { mockAuth } from "../middleware/mock.middleware";

export const submissionRouter = Router();

// User protected route 
submissionRouter.post("/" , mockAuth , addSubmission);