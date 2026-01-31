import {Router} from "express";
import { addQuestion, deleteQuestion, getAllQuestions, getQuestion, run, submitCode, totalQuestion } from "../controllers/question.controller";

export const questionRouter = Router();

// Needed to be Admin protected 
questionRouter.delete("/delete/:questionId" , deleteQuestion);
questionRouter.post("/add" , addQuestion); 

// not protected right now 
questionRouter.get("/all" , getAllQuestions);

// needed to be user Protected 
questionRouter.post("/run", run);
questionRouter.post("/submit" , submitCode );
questionRouter.get("/total" , totalQuestion);

questionRouter.get("/:id" , getQuestion);;

/**
 * Task : 
 * Make the sumit to connect with the database and submission model
 * via frontend we call the sumbit and then we save the data to the submission model 
 * 
 */