"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contestRouter = void 0;
const express_1 = require("express");
const contest_controller_1 = require("../controllers/contest.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
exports.contestRouter = (0, express_1.Router)();
exports.contestRouter.get("/", contest_controller_1.getAllContests);
exports.contestRouter.get("/my/registered", auth_middleware_1.isUserLoggedIn, contest_controller_1.getMyContests);
// User Protected Routes
exports.contestRouter.get("/:contestId", contest_controller_1.getContestById);
exports.contestRouter.post("/:contestId/register", auth_middleware_1.isUserLoggedIn, contest_controller_1.registerContest);
exports.contestRouter.delete("/:contestId/unregister", auth_middleware_1.isUserLoggedIn, contest_controller_1.unregisterContest);
// Admin Protected Routes
// (Replace isUserLoggedIn with isAdmin middleware when you create one)
exports.contestRouter.post("/", auth_middleware_1.isAdminLoggedIn, contest_controller_1.createContest);
exports.contestRouter.put("/:contestId", auth_middleware_1.isAdminLoggedIn, contest_controller_1.updateContest);
exports.contestRouter.delete("/:contestId", auth_middleware_1.isAdminLoggedIn, contest_controller_1.deleteContest);
