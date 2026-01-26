import {Router} from "express";
import { addQuestion, deleteQuestion, getAllQuestions, run, submitCode } from "../controllers/question.controller";

export const questionRouter = Router();

// Needed to be Admin protected 
questionRouter.delete("/delete/:questionId" , deleteQuestion);
questionRouter.post("/add" , addQuestion); 

// not protected right now 
questionRouter.get("/all" , getAllQuestions);

// needed to be user Protected 
questionRouter.post("/run", run);
questionRouter.post("/submit" , submitCode );


/**
 * Task : 
 * Make the sumit to connect with the database and submission model
 * via frontend we call the sumbit and then we save the data to the submission model 
 * 
 */