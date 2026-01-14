import {Router} from "express";
import { getHiddenTestCases, getVisibleTestCase } from "../controllers/testCase.controller";

const testCaseRouter = Router();

testCaseRouter.get("/visible/:questionId" , getVisibleTestCase);
testCaseRouter.get("/hidden/questionId" , getHiddenTestCases);