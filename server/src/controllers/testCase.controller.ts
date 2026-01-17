import { Request , Response , NextFunction } from "express";
import { TestCaseInterface, testCaseModel } from "../models/testCase.model";
import createTestCaseSchema from "../validation/testCase.validation";
import { parse } from "dotenv";

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

  export const addTestCase = async(req : Request , res : Response , next : NextFunction)=>{
    try{
      const parsed = createTestCaseSchema.safeParse(req.body);

      if(!parsed.success){
        return res.status(400).json({
          error : parsed.error.format()
        })
      };

      const newTestCases = await testCaseModel.insertMany(parsed.data);
      
      if(!newTestCases){
        return res.status(400).json({
          success : false , 
          message: "New Test case is not created"
        });
      }

      return res.status(201).json({
        success : true  , 
        message : "New Test Case Created" ,
        data : {
          newTestCases
        }
      })

    }catch(err){
      next(err);
    }
  }

export const deleteTestCase = async(req : Request , res : Response , next : NextFunction)=>{
  try{
    const testCaseId = req.params.testCaseId;

    const testCase = await testCaseModel.findByIdAndDelete(testCaseId);

    if(!testCase){
      return res.status(404).json({
        success : false ,
        message : "Not Test Case found"
      })
    }

    return res.status(200).json({
      success : true , 
      message : "This test case deleted"
    })

  }catch(err){
    next(err);
  }
}