import {Request , Response , NextFunction} from "express";
import bcrypt from "bcrypt";
import { userSchema } from "../validation/user.validation";
import { JWT_SECRET, SALT_ROUND } from "../configs/env.config";
import { userModel } from "../models/user.model";
import jwt from "jsonwebtoken";

export const registerNewUser = async(req :Request , res : Response , next : NextFunction)=>{
  try{
    const parsed = userSchema.safeParse(req.body);

    if(!parsed.success){
      return res.status(400).json({
        success : false , 
        error : parsed.error.format()
      })
    }

    const {username , email , password} = parsed.data;

    const salt = await bcrypt.genSalt(Number(SALT_ROUND));  
    const hashedPassword = await bcrypt.hash(password , salt);

    const user = await userModel.create({
      username , 
      email , 
      password : hashedPassword
    });

    if(!user){
      return res.status(400).json({
        success : false , 
        message : "Error in creating user"
      })
    }

    const token = jwt.sign({email}, JWT_SECRET as string);

    res.cookie("token" , token) ;

    return res.status(201).json({
      success : true ,
      message : "User Registered Successfully" ,  
      user 
    });

  }catch(err){
    next(err);
  }
}

export const loginUser = async (req : Request , res : Response , next : NextFunction)=>{
  try{

  }catch(err){
    next(err);
  }
}

export const logoutUser = async(req : Request, res: Response , next : NextFunction)=>{
  try{

  }catch(err){
    next(err);
  }
}