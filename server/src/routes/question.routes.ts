import {Router} from "express";
import { addQuestion, deleteQuestion, run, submitCode } from "../controllers/question.controller";

export const questionRouter = Router();

// All Needed to be Admin protected 
questionRouter.delete("/delete/:questionId" , deleteQuestion);
questionRouter.post("/add" , addQuestion); 
questionRouter.post("/run", run);
questionRouter.post("/submit" , submitCode );