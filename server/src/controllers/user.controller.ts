import {Request , Response , NextFunction} from "express";

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
