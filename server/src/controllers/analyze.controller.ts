import { authRequest } from "../types/authRequest.type";
import { Response , NextFunction } from "express";

export const analyzeCode = async(req : authRequest , res : Response  , next : NextFunction)=>{
  try{
    
  }catch(error){
    next(error);
  }
}