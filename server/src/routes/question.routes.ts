import {Router} from "express";
import { addQuestion } from "../controllers/question.controller";

export const questionRouter = Router();

// All Needed to be Admin protected 
questionRouter.post("/add" , addQuestion);