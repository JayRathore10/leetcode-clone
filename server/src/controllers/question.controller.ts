import { Request, Response, NextFunction  } from "express";
import { questionSchema } from "../validation/question.validation";
import { questionModel } from "../models/question.model";
import { testCaseModel } from "../models/testCase.model";
import axios from "axios";
import { authRequest } from "../types/authRequest.type";

interface ResultInterface {
  test: number,
  status: string
};

export const addQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = questionSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.format()
      })
    };

    const { title, description, difficulty, tags, constraints, example } = parsed.data;

    const newQuestion = await questionModel.create({
      title,
      description,
      difficulty,
      tags,
      constraints,
      example
    });

    if (!newQuestion) {
      return res.status(400).json({
        success: false,
        message: "New Question is not created"
      });
    }

    return res.status(201).json({
      success: true,
      message: "New Question Created",
      data: {
        newQuestion
      }
    });

  } catch (err) {
    next(err);
  }
}

export const deleteQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questionId = req.params.questionId;

    if (!questionId) {
      return res.status(404).json({
        success: false,
        message: "Enter the question Id"
      });
    }

    const question = await questionModel.findByIdAndDelete(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question Not found"
      })
    }
 
    return res.status(200).json({
      success: true,
      message: "Question delete successfully"
    })

  } catch (err) {
    next(err);
  }
}

export const run = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { questionId, language, code } = req.body;

    if (!questionId || !language || !code) {
      return res.status(400).json({
        success: false,
        message: `Code  , language or questionId is not mentioned`
      });
    }

    const visibleTestCases = await testCaseModel.find({ questionId: questionId, isHidden: false });

    if (!visibleTestCases) {
      return res.status(404).json({
        success: false,
        message: "Not Test Case found"
      })
    }

    let result: ResultInterface[] = [];

    for (let i = 0; i < visibleTestCases.length; i++) {
      const tc = visibleTestCases[i];

      const response = await axios.post(
        "https://emkc.org/api/v2/piston/execute",
        {
          language,
          version: "*",
          files: [{ name: "main", content: code }],
          stdin: tc.input
        }
      );

      // Compilation Error 
      if(response.data.compile?.stderr){
        return res.status(200).json({
          success : false , 
          status : "WA"   ,
          errorType : "Compilation Error" , 
          message : response.data.compile.stderr
        })
      }

      // Time Limit Exceeded  
      const run = response.data.run ;

      if(run.signal === "SIGXCPU"){
        return res.status(200).json({
          success : false , 
          status : "TLE" , 
          failedTest : i + 1 , 
          message : "Time Limit Exceeded"
        })
      }

      // Memory Limit Exceeded 
      if(run.signal === "SIGSEGV"){
        return res.status(200).json({
          success : false , 
          status : "MLE" ,
          failedTest : i + 1 , 
          message : "Memory Limit Exceeded"
        });
      }

      // Runtime Error
      if(run.stderr){
        return res.status(200).json({
          success : false , 
          status : "WA" , 
          failedTest : i + 1 , 
          errorType : "Runtime Error" , 
          message : run.stderr
        })
      }

      // For Wrong answer 
      // Test Case expected != actual output 
      const actual = response.data.run.stdout.trim();
      const expected = tc.output.trim();

      if (actual != expected) {
        return res.status(200).json({
            success : false , 
            status: "WA",
            failedTest: i + 1,
            expected,
            actual
        });
      }
      result.push({ test: i + 1, status: "Passed" });
    }

    return res.status(200).json({
      success: true,
      result
    });

  } catch (err) {
    next(err);
  }
}

export const submitCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { questionId, code, language } = req.body;

    if (!questionId || !code || !language) {
      return res.status(404).json({
        success: false,
        message: `
          ${!questionId || !code || !language} is mention in the call
        `
      })
    }

    const allTestCase = await testCaseModel.find({ questionId: questionId });

    if (!allTestCase) {
      return res.status(404).json({
        success: false,
        message: "Test Cases are not present"
      })
    }

    let result: ResultInterface[] = [];

    for (let i = 0; i < allTestCase.length; i++) {
      const tc = allTestCase[i];

      const response = await axios.post(
        "https://emkc.org/api/v2/piston/execute",
        {
          language,
          version: "*",
          files: [{ name: "main", content: code }],
          stdin: tc.input
        }
      );

      // Compilation Error 
      if(response.data.compile?.stderr){
        return res.status(200).json({
          status : "WA" ,
          errorType : "Compilation Error" , 
          message : response.data.compiler
        })
      } 

      // Time Limit Exceeded 
      const run = response.data.run ;
      if(run.signal === "SIGXCPU"){
        return res.status(200).json({
          status : "TLE" , 
          failedTest : i + 1 , 
          message : "Time Limit Exceeded" 
        })
      }

      // Memory Limit Exceeded 
      if(run.signal === "SIGSEGV"){
        return res.status(200).json({
          status : "MLE" ,
          failedTest : i + 1 , 
          message  : "Memory Limit Exceeded"
        })
      }

      // Runtime Error 
      // if(run.stderr){
      //   return res.status(200).json({
      //     status : "WA" , 
      //     failedTest : i + 1 , 
      //     errorType : "Runtime Error"  , 
      //     messsage : run.stderr
      //   })
      // }

      // For wrong answer 
      const actual = response.data.run.stdout.trim();
      const expected = tc.output.trim();

      if (actual !== expected) {
        return res.status(200).json({
            status: "WA",
            failedTest: i + 1,
            expected,
            actual,
            totalTest : allTestCase.length
        })
      }

      result.push({ test: i + 1, status: "Passed" })
    }

    return res.status(200).json({
      success: true,
        status: "Accepted",
        totalTest: allTestCase.length
    })

  } catch (err) {
    next(err);
  }
}

export const getAllQuestions = async(req : authRequest , res : Response  , next : NextFunction)=>{
  try{
    // for question(problem Table)
    const allQuestions = await questionModel.find();

    if(allQuestions.length === 0){
      return res.status(404).json({
        success : false , 
        message : "There is not question in database"
      });
    }

    return res.status(200).json({
      success : true , 
      message : "This are all questions" , 
      questions : allQuestions, 
    });

  }catch(err){
    next(err);
  }
}

export const getQuestion = async(req : authRequest  , res: Response , next : NextFunction)=>{
  try{
    const id = req.params.id;

    const question = await questionModel.findById(id);

    if(!question){
      return res.status(404).json({
        success : false  , 
        message : "Question not found"
      })
    }

    return res.status(200).json({
      success : true , 
      message : "This is Question" , 
      question 
    })

  }catch(err){
    next(err);
  }
}

export const totalQuestion = async(req : authRequest , res : Response , next : NextFunction)=>{
  try{
    const totalQuestion = await questionModel.find();

    if(totalQuestion.length === 0 ){
      return res.status(400).json({
        success : false   , 
        message : "There are no questions in database"
      })
    }

    return res.status(200).json({
      success : true ,  
      message : "Total Number of Questions" , 
      totalQuestion : totalQuestion.length
    })

  }catch(error){
    next(error);
  }
}