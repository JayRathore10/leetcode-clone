import mongoose from "mongoose";

export interface TestCaseInterface{
  questionId : mongoose.Schema.Types.ObjectId, 
  input : string , 
  output : string , 
  isHidden : boolean 
};

const testCaseSchema = new mongoose.Schema({
  questionId : {
    type : mongoose.Schema.Types.ObjectId , 
    required : true ,
    ref : "Question"
  }, 
  input : {
    type : String ,
    required : true, 
  } ,
  output : {
    type : String  ,
    required : true ,
  },
  isHidden : Boolean
});

export const testCaseModel = mongoose.model("TestCase", testCaseSchema);
