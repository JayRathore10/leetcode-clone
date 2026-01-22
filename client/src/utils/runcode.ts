import axios from "axios";

interface RunCodeInterface {
  code : string , 
  language : string , 
  questionId : string 
  setOutput : React.Dispatch<React.SetStateAction<string>>;
} 

export async function runCode({setOutput , code , language , questionId} : RunCodeInterface){
  try{
    const res = await axios.post("http://localhost:3000/api/question/run" , {
      code , 
      language , 
      questionId : questionId
    })  ;

    setOutput(JSON.stringify(res.data.result, null, 2));
    console.log(res.data.result);

  }catch(err){
    console.error(err);
    setOutput("Error in running code");
  }
}