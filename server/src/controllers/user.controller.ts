import {Request , Response , NextFunction} from "express";
import { userModel } from "../models/user.model";
import { success } from "zod";
import { submissionModel } from "../models/submission.model";

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

export const getAllUsers = async (req : Request , res : Response  , next : NextFunction)=>{
  try{
    const users = await userModel.find();

    if(users.length === 0){
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

export const getByUsername = async (req : Request, res : Response  , next : NextFunction)=>{
  try{  
    const {username} = req.params;

    if(!username) {
      return res.status(404).json({
        success : false ,
        message : "Wrong route"
      })
    }

    const user = await userModel.findOne({username : username});

    if(!user){
      return res.status(404).json({
        success : false ,
        message : "User not found"
      })
    }

    return res.status(200).json({
      success : true , 
      message : "User Details" ,
      data : {user}
    });

  }catch(err){
    next(err);
  }
}

export const getAllSubmission = async (req : Request  , res : Response, next : NextFunction)=>{
  try{
    const username = req.params.username;

    const user = await userModel.findOne({username});

    if(!user){
      return res.status(404).json({
        success : false , 
        message : "User not found"
      })
    }

    const submissions = await submissionModel.find({userId : user._id});

    if(submissions.length === 0){
      return res.status(200).json({
        success : true , 
        message : "No Submission found" , 
        submissions : []
      })
    }

    return res.status(200).json({
      success : true ,
      message : "All Submissions" ,
      data : {
        submissions
      }
    })

  }catch(err){
    next(err);
  }
}