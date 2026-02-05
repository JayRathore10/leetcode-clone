import {Request , Response , NextFunction} from "express";
import bcrypt from "bcrypt";
import { userLoginSchema, userSchema } from "../validation/user.validation";
import { JWT_SECRET, SALT_ROUND } from "../configs/env.config";
import { authRequest, userPlayLoad } from "../types/authRequest.type";
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

    const {username , email , password , name} = parsed.data;

    const isUserExist = await userModel.findOne({email});

    if(isUserExist){
      return res.status(400).json({
        success: false , 
        message : "User Already Exists"
      })
    }

    const salt = await bcrypt.genSalt(Number(SALT_ROUND));  
    const hashedPassword = await bcrypt.hash(password , salt);

    const user = await userModel.create({
      username , 
      email , 
      password : hashedPassword ,
      name 
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
    const parsed = userLoginSchema.safeParse(req.body);
    
    if(!parsed.success){
      return res.status(400).json({
        success : false ,
        error : parsed.error.format()
      })
    }

    const {email  , password} = parsed.data;

    const user = await userModel.findOne({email});

    if(!user){
      return res.status(404).json({
        success: false , 
        message : "User Not found"
      })
    }

    let result = await bcrypt.compare(password , user.password);

    if(result === false){
      return res.status(400).json({
        success : false , 
        message : "Password is invalid"
      })
    }

    const token = jwt.sign({email} , JWT_SECRET as string);

    res.cookie("token" , token);

    return res.status(200).json({
      success : true , 
      message : "Login successfully",
      user 
    })

  }catch(err){
    next(err);
  }
}

export const logoutUser = async(req : Request, res: Response , next : NextFunction)=>{
  try{
    // procted have to make middleware for it 
    res.clearCookie("token");
    return res.status(200).json({
      success : true , 
      message : "Log out successfully"
    })
  }catch(err){
    next(err);
  }
}

export const me = async(req : authRequest, res : Response  , next : NextFunction)=>{
  try{
    const authHeader = req.headers.authorization;

    if(!authHeader){
      return res.status(401).json({
        message : "No Token"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token , JWT_SECRET as string) as userPlayLoad;

    const user = await userModel.findById(decoded.userId).select("-password");

    if(!user){
      return res.status(401).json({
        message  : "User not found"
      });
    }

    return res.status(200).json({
      success : true   , 
      user 
    });

  }catch(error){
    next(error);
  }
}