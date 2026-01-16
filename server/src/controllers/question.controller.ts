import {Request, Response , NextFunction} from "express";
import { questionSchema } from "../validation/question.validation";
import { questionModel } from "../models/question.model";

export const addQuestion = async(req : Request , res : Response ,next : NextFunction)=>{
  try{  
    const parsed = questionSchema.safeParse(req.body);

    if(!parsed.success){
      return res.status(400).json({
        error : parsed.error.format()
      })
    };

    const {title , description , difficulty , tags , constraints , example} = parsed.data;

    const newQuestion = await questionModel.create({
      title , 
      description , 
      difficulty , 
      tags , 
      constraints , 
      example
    });

    if(!newQuestion){
      return res.status(400).json({
        success : false, 
        message : "New Question is not created"
      });
    }

    return res.status(201).json({
      success : true  , 
      message : "New Question Created" , 
      data : {
        newQuestion
      }
    });    

  }catch(err){
    next(err);
  }
}

export const deleteQuestion = async(req : Request, res : Response , next : NextFunction)=>{
  try{
    const questionId = req.params.questionId;

    if(!questionId){
      return res.status(404).json({
        success : false , 
        message : "Enter the question Id"
      });
    }

    const question = await questionModel.findByIdAndDelete(questionId);

    if(!question){
      return res.status(404).json({
        success : false , 
        message : "Question Not found"
      })
    }

    return res.status(200).json({
      success : true , 
      message : "Question delete successfully"
    })

  }catch(err){
    next(err);
  }
}