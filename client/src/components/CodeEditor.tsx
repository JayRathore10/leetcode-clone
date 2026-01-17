import { Editor } from "@monaco-editor/react";
import { useEffect } from "react";

interface CodeEditorProps {
  code : string  ,
  setCode : React.Dispatch<React.SetStateAction<string>>;
  language : string 
}

const boilerplates: Record<string, string> = {
  javascript: `/**
 * Write your solution here
 */
function solution() {

}

// Example call
console.log(solution());
`,

  cpp: `#include <bits/stdc++.h>
using namespace std;

/*
 Write your solution here
*/
void solve() {

}

int main() {
    solve();
    return 0;
}
`,

  python: `# Write your solution here
def solve():
    pass

# Example call
# print(solve())
`,

  java: `class Solution {

    // Write your solution here
    static void solve() {

    }

    public static void main(String[] args) {
        solve();
    }
}
`
};


export function CodeEditor({code , setCode , language} : CodeEditorProps){

  useEffect(()=>{
    setCode(boilerplates[language || "cpp"]);
  } , [language , setCode])

  return(
    <>
      <Editor
        height = "90vh"
        width= "90vw"
        language={language || "cpp"}
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

/**
 * 
 * i give default value as the biolerplate code for all langauges and with a solve fuction then the function take the paramter by user 
 * 
 */