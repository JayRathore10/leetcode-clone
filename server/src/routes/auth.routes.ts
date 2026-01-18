import {Router} from "express";
import { loginUser, logoutUser, registerNewUser } from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/register" , registerNewUser);
authRouter.post("/login" , loginUser);
// protected route
authRouter.get("/logout" , logoutUser);