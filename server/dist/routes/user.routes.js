"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_utility_1 = require("../utils/upload.utility");
exports.userRouter = (0, express_1.Router)();
// Make this route admin procted  
exports.userRouter.get("/all", auth_middleware_1.isAdminLoggedIn, user_controller_1.getAllUsers);
// User protected route 
exports.userRouter.get("/profile", auth_middleware_1.isUserLoggedIn, user_controller_1.getUserProfile);
exports.userRouter.put("/profile", auth_middleware_1.isUserLoggedIn, upload_utility_1.upload.single("profilePic"), user_controller_1.editProfile);
exports.userRouter.get("/:username", user_controller_1.getByUsername);
exports.userRouter.get("/:username/all-submissions", user_controller_1.getAllSubmission);
// Admin protected routes for user management
exports.userRouter.delete("/:userId", auth_middleware_1.isAdminLoggedIn, user_controller_1.deleteUser);
exports.userRouter.put("/:userId/role", auth_middleware_1.isAdminLoggedIn, user_controller_1.updateUserRole);
