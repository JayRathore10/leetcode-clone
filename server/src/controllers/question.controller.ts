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