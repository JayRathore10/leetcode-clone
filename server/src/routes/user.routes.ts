import { Router } from "express";
import { getAllSubmission, getAllUsers, getByUsername, test } from "../controllers/user.controller";

export const userRouter = Router();

userRouter.get("/test" , test);
// Make this route protected for admin 
userRouter.get("/all", getAllUsers);
userRouter.get("/:username" , getByUsername);
userRouter.get("/:username/all-submissions" , getAllSubmission);