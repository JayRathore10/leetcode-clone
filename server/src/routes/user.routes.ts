import { Router } from "express";
import { editProfile, getAllSubmission, getAllUsers, getByUsername, getUserProfile } from "../controllers/user.controller";
import { isAdminLoggedIn, isUserLoggedIn } from "../middleware/auth.middleware";
import { upload } from "../utils/upload.utility";

export const userRouter = Router();


// Make this route admin procted  
userRouter.get("/all", isAdminLoggedIn , getAllUsers);
// User protected route 
userRouter.get("/profile" , isUserLoggedIn , getUserProfile);
userRouter.put("/profile"  , isUserLoggedIn  , upload.single("profilePic") , editProfile);

userRouter.get("/:username"  , getByUsername);
userRouter.get("/:username/all-submissions" , getAllSubmission);