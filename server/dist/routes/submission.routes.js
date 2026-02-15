"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submissionRouter = void 0;
const express_1 = require("express");
const submission_controller_1 = require("../controllers/submission.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
exports.submissionRouter = (0, express_1.Router)();
// User protected route 
exports.submissionRouter.post("/", auth_middleware_1.isUserLoggedIn, submission_controller_1.addSubmission);
exports.submissionRouter.get("/", auth_middleware_1.isUserLoggedIn, submission_controller_1.userAllSubmission);
exports.submissionRouter.get("/:id", auth_middleware_1.isUserLoggedIn, submission_controller_1.getSubmissionDetail);
