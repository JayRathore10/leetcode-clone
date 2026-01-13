import mongoose from "mongoose";

export interface SubmissionInterface {
  userId : mongoose.Schema.Types.ObjectId, 
  questionId : mongoose.Schema.Types.ObjectId , 
  code : string   , 
  language : string ,
  status : "Accepted" | "WA" | "TLE" | "MLE" , 
  createdAt : Date 
}

const submissionSchema = new mongoose.Schema({
  userId : {
    type : mongoose.Schema.Types.ObjectId , 
    ref : "User" , 
    required : true ,
  } , 
  questionId : {
    type : mongoose.Schema.Types.ObjectId ,
    ref : "Question"  , 
    required : true ,
  } , 
  code : {
    type : String , 
    required : true ,
  }, 
  language : {
    type : String   ,
    required : true , 
  } , 
  status :  {
    type : String , 
    enum : ["Accepted" , "WA" , "TLE" , "MLE"]
  } , 
  createdAt : {
    type : Date , 
    default : Date.now
  }
} , {timestamps : true});

export const submissionModel = mongoose.model("Submission" , submissionSchema);