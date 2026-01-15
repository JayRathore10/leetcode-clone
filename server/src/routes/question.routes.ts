import {Router} from "express";
import { addQuestion, deleteQuestion } from "../controllers/question.controller";

export const questionRouter = Router();

// All Needed to be Admin protected 
questionRouter.post("/add" , addQuestion);
questionRouter.post("/delete" , deleteQuestion);