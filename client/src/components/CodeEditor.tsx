import { Editor } from "@monaco-editor/react";

interface CodeEditorProps {
  code : string  ,
  setCode : React.Dispatch<React.SetStateAction<string>>;
  language : string 
}

export function CodeEditor({code , setCode , language} : CodeEditorProps){

  return(
    <>
      <Editor
        height = "90vh"
        width= "90vw"
        language={language || "cpp"}
        defaultValue="// Write your code here"
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value || "")}
      /> 
    </>
  )
}

/**
 * 
 * MY next Task is not make the editor to run the test summit the test 
 * and check auto input and output for it 
 * also the erorr in this 
 * and also run the test cases 
 * if it clear all the test case then it 
 * accecpted and correct answer 
 * 
 */