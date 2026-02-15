"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/register", auth_controller_1.registerNewUser);
exports.authRouter.post("/login", auth_controller_1.loginUser);
// protected route
exports.authRouter.post("/logout", auth_middleware_1.isUserLoggedIn, auth_controller_1.logoutUser);
exports.authRouter.get("/me", auth_controller_1.me);
