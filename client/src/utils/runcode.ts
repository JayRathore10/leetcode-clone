import axios from "axios";
import { env } from "../configs/env.config";

export interface testCaseFields  {
  test : number , 
  status : string , 
  failedTest : number , 
  expected : string , 
  actual : string  , 
  errorType : string
};

export interface RunCodeInterface {
  code : string , 
  language : string , 
  questionNumber : string 
  setOutput : React.Dispatch<React.SetStateAction<testCaseFields[]>>;
} 

export async function runCode({ setOutput, code , language , questionNumber} : RunCodeInterface){
  try{
    const res = await axios.post(`${env.backendUrl}/api/question/run` , {
      code , 
      language , 
      questionId : questionNumber
    })  ;

    // setOutput(JSON.stringify(res.data.result, null, 2));
    setOutput(res.data.result);
    console.log(res.data.result);

  }catch(err){
    console.error(err);
    setOutput([]);
  }
}