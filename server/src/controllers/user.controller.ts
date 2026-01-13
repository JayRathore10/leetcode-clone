import {Request , Response , NextFunction} from "express";
import { userModel } from "../models/user.model";
import { success } from "zod";

export const test = (req : Request, res: Response, next : NextFunction)=>{
  try{
    return res.status(200).json({
      success : true  ,
      message : "Hello" 
    })
  }catch(err){
    next(err);
  }
}

export const getAllUsers = (req : Request , res : Response  , next : NextFunction)=>{
  try{
    const users = userModel.find();
    if(!users){
      return res.status(404).json({
        success : false , 
        message : "No User found"
      });
    }

    return res.status(200).json({
      success  : true   ,  
      message : "All Users" ,
      data : {
        users
      } 
    });

  }catch(err){
    next(err);
  }
}