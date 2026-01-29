import axios from "axios";
import { env } from "../configs/env.config";

export interface RunCodeInterface {
  code : string , 
  language : string , 
  questionNumber : string 
  // setOutput : React.Dispatch<React.SetStateAction<string>>;
} 

export async function runCode({code , language , questionNumber} : RunCodeInterface){
  try{
    const res = await axios.post(`${env.backendUrl}/api/question/run` , {
      code , 
      language , 
      questionId : questionNumber
    })  ;

    // setOutput(JSON.stringify(res.data.result, null, 2));
    console.log(questionNumber);
    console.log(res.data.result);

  }catch(err){
    console.error(err);
    // setOutput("Error in running code");
  }
}