import {Router} from "express";
import { loginUser, logoutUser, registerNewUser } from "../controllers/auth.controller";
import { isUserLoggedIn } from "../middleware/auth.middleware";

export const authRouter = Router();

authRouter.post("/register" , registerNewUser);
authRouter.post("/login" , loginUser);
// protected route
authRouter.post("/logout", isUserLoggedIn , logoutUser);