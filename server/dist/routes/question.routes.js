"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionRouter = void 0;
const express_1 = require("express");
const question_controller_1 = require("../controllers/question.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
exports.questionRouter = (0, express_1.Router)();
// Needed to be Admin protected 
exports.questionRouter.delete("/delete/:questionId", question_controller_1.deleteQuestion);
exports.questionRouter.post("/add", question_controller_1.addQuestion);
// not protected right now 
exports.questionRouter.get("/all", question_controller_1.getAllQuestions);
// needed to be user Protected 
exports.questionRouter.post("/run", auth_middleware_1.isUserLoggedIn, question_controller_1.run);
exports.questionRouter.post("/submit", auth_middleware_1.isUserLoggedIn, question_controller_1.submitCode);
exports.questionRouter.get("/total", question_controller_1.totalQuestion);
exports.questionRouter.get("/:id", question_controller_1.getQuestion);
;
/**
 * Task :
 * Make the sumit to connect with the database and submission model
 * via frontend we call the sumbit and then we save the data to the submission model
 *
 */ 
