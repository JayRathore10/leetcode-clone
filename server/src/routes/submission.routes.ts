import {Router} from "express";
import { addSubmission } from "../controllers/submission.controller";

export const submissionRouter = Router();

// User protected route 
submissionRouter.post("/" , addSubmission);