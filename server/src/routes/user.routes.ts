import { Router } from "express";
import { getAllUsers, getByUsername, test } from "../controllers/user.controller";

export const userRouter = Router();

userRouter.get("/test" , test);
// Make this route protected for admin 
userRouter.get("/all", getAllUsers);
userRouter.get("/:username" , getByUsername);