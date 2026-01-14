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

export const getAllUsers = async (req : Request , res : Response  , next : NextFunction)=>{
  try{
    const users = await userModel.find();
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