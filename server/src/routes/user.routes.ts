import { Router } from "express";
import { getAllUsers, test } from "../controllers/user.controller";

export const userRouter = Router();

userRouter.get("/test" , test);
userRouter.get("/all", getAllUsers);