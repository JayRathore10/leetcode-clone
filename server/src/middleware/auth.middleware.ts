import {Request , Response , NextFunction} from "express";
import jwt from "jsonwebtoken";

export const isUserLoggedIn = async(req : Request , res : Response , next : NextFunction)=>{
  try{
    
  }catch(error){
    next(error);
  }
}