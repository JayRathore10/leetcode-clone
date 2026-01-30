import axios from "axios";
import { env } from "../configs/env.config";

export interface testCaseFields  {
  success ?: boolean
  status ?: "Accepted" | "WA" | "TLE" | "MLE" , 
  failedTest ?: number , 
  expected ?: string , 
  actual ?: string
  message ?: string
};

export interface RunCodeInterface {
  code : string , 
  language : string , 
  questionNumber : string 
  setOutput : React.Dispatch<React.SetStateAction<testCaseFields >>;
  setIsRunning : React.Dispatch<React.SetStateAction<boolean>>;
} 

export async function runCode({ setOutput, code , language , questionNumber , setIsRunning} : RunCodeInterface){
  try{

    setIsRunning(true);

    const res = await axios.post(`${env.backendUrl}/api/question/run` , {
      code , 
      language , 
      questionId : questionNumber
    })  ;

    // setOutput(JSON.stringify(res.data.result, null, 2));
    setOutput(res.data);
    console.log(res.data.result);

  }catch(err){
    console.error(err);
    setOutput({});
  }finally{
    setIsRunning(false);
  }
}