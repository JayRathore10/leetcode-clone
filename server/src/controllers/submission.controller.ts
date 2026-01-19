import { Response , NextFunction } from 'express';
import { authRequest } from '../types/authRequest.type';
import { submissionSchema } from '../validation/submission.validation';
import { submissionModel } from '../models/submission.model';

export const addSubmission = async(req : authRequest,  res : Response , next : NextFunction)=>{
  try{
    const userId = req.user?._id.toString();

    const parsed = submissionSchema.safeParse(req.body);

    if(!parsed.success){
      return res.status(400).json({
        success : false , 
        error : parsed.error.format()
      })
    }

    const {questionId , code ,language , status} = parsed.data;

    const newSubmission = await submissionModel.create({
      userId , 
      questionId ,
      code , 
      language , 
      status ,
    });

    if(!newSubmission){
      return res.status(400).json({
        success : false , 
        message : "Error in creating Submission"
      });
    }

    return res.status(201).json({
      success : true,
      message : "New Submission Created" ,
      submission : newSubmission 
    });

  }catch(err){
    next(err);
  }
}