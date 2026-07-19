import {Router} from "express";
import { addTestCase, deleteTestCase, getHiddenTestCases, getVisibleTestCase } from "../controllers/testCase.controller";
import { isAdminLoggedIn } from "../middleware/auth.middleware";

export const testCaseRouter = Router();

// All Needed Admin Protected routes
testCaseRouter.get("/visible/:questionId" , getVisibleTestCase);

testCaseRouter.get("/hidden/:questionId" , getHiddenTestCases);

testCaseRouter.delete("/delete/:testCaseId" , isAdminLoggedIn , deleteTestCase);

testCaseRouter.post("/add" , isAdminLoggedIn, addTestCase);