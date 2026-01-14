import { Request , Response , NextFunction } from "express";
import { testCaseModel } from "../models/testCase.model";

export const getVisibleTestCase = async(req : Request , res : Response , next  : NextFunction)=>{
  try{
    const questionId = req.params.questionId;

    const testCases = await testCaseModel.find({questionId , isHidden : false });

    if(testCases.length === 0){
      return res.status(404).json({
        success : false , 
        message : "Test Cases are not found"
      })
    }

  return res.status(200).json({
    success : true , 
    message : "These are the test cases" , 
    data : {
      testCases
    }
  })

  }catch(err){
    next(err);
  }
} 

export const getHiddenTestCases  = async (req : Request , res : Response , next : NextFunction)=>{
  try{
    const questionId = req.params.questionId;

    const testCases = await testCaseModel.find({questionId  , isHidden : true});

    if(testCases.length === 0){
      return res.status(404).json({
        success : false , 
        message : "No test Case found" , 
      });
    }

    return res.status(200).json({
      success : true , 
      message : "These are all hidden test cases" ,
      data :  {
        testCases
      } 
    });

  }catch(error){
    next(error);
  }
}

