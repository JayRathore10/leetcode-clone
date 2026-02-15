"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testCaseRouter = void 0;
const express_1 = require("express");
const testCase_controller_1 = require("../controllers/testCase.controller");
exports.testCaseRouter = (0, express_1.Router)();
// All Needed Admin Protected routes
exports.testCaseRouter.get("/visible/:questionId", testCase_controller_1.getVisibleTestCase);
exports.testCaseRouter.get("/hidden/:questionId", testCase_controller_1.getHiddenTestCases);
exports.testCaseRouter.delete("/delete/:testCaseId", testCase_controller_1.deleteTestCase);
exports.testCaseRouter.post("/add", testCase_controller_1.addTestCase);
