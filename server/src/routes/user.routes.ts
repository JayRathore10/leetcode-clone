import { Router } from "express";
import { getAllSubmission, getAllUsers, getByUsername, getUserProfile, test } from "../controllers/user.controller";

export const userRouter = Router();

userRouter.get("/test" , test);
// Make this route admin procted  
userRouter.get("/all", getAllUsers);
// User protected route 
userRouter.get("/profile"  , getUserProfile);
userRouter.get("/:username" , getByUsername);
userRouter.get("/:username/all-submissions" , getAllSubmission);