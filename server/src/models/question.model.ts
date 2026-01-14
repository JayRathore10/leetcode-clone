import mongoose, { mongo } from "mongoose";

export interface QuestionInterface {
  title : string, 
  description : string , 
  difficulty  : "Easy" | "Medium" | "Hard" , 
  tags : string[] , 
  constraints : string[] , 
  example: {
    input: string;
    output: string;
    explanation: string;
  };
}

const questionSchema = new mongoose.Schema<QuestionInterface>({
  title : {
    type : String ,
    required : [true , "Question title is needed"] , 
  },
  description : {
    type : String  , 
    required : [true, "Question description is needed"] 
  }, 
  difficulty : {
    type : String ,
    enum : ["Easy" , "Medium" , "Hard"]
  } , 
  tags : {
    type : [String],
    default : []
  } ,
  constraints : {
    type : [String]
  } , 
  example : {
    input : String  , 
    output : String , 
    explanation : String
  }
}, {timestamps : true});

export const questionModel = mongoose.model<QuestionInterface>("Question", questionSchema)