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
 * IMPORTANT:
 * - Do NOT return the answer
 * - PRINT the answer using console.log()
 */
function solution() {

    // Example:
    // console.log(answer);
}

// Call the function
solution();
`,

  cpp: `#include <bits/stdc++.h>
using namespace std;

/*
 Write your solution here
 IMPORTANT:
 - Do NOT return the answer
 - PRINT the answer using cout
*/
void solve() {

    // Example:
    // cout << answer << endl;
}

int main() {
    solve();
    return 0;
}
`,

  python: `# Write your solution here
# IMPORTANT:
# - Do NOT return the answer
# - PRINT the answer using print()

def solve():
    # Example:
    # print(answer)
    pass  # Remove this line before writing your code

# Call the function
solve()
`,

  java: `class Solution {

    // Write your solution here
    // IMPORTANT:
    // - Do NOT return the answer
    // - PRINT the answer using System.out.println()
    static void solve() {

        // Example:
        // System.out.println(answer);
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

