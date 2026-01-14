import {Router} from "express";
import { addTestCase, getHiddenTestCases, getVisibleTestCase } from "../controllers/testCase.controller";

const testCaseRouter = Router();

// Needed Admin Protected routes
testCaseRouter.get("/visible/:questionId" , getVisibleTestCase);

testCaseRouter.get("/hidden/questionId" , getHiddenTestCases);

testCaseRouter.post("/add" , addTestCase);