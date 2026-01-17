import { useEffect, useState } from 'react';
import './App.css'
import { CodeEditor } from './components/CodeEditor';
import LanguageSelect from './components/LanguageSelect';
import { runCode } from './utils/runcode';
import axios from 'axios';


function App() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState("");
  // const [input, setInput] = useState("");

  // async function runCode() {
  //   try {
  //     const res = await axios.post(
  //       "https://emkc.org/api/v2/piston/execute",
  //       {
  //         language: language,
  //         version: "*",
  //         files: [
  //           {
  //             name: "main",
  //             content: code
  //           },
  //         ],
  //         stdin: input || "",
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         }
  //       }
  //     );

  //     const { stdout, stderr } = res.data.run;
  //     setOutput(stdout || stderr || "No Output");
  //     setInput("");
  //   } catch (err) {
  //     setOutput("Error Running Code");
  //     console.log(err);
  //   }
  // }

  useEffect(()=>{
    const check = async ()=>{
      const response = await axios.get("http://localhost:3000");
      console.log(response.data);
    }
    check();
  } , []);

  const questionId = "696b5654f83d5bf85f2953e4";

  const runHandle = async()=>{
    console.log(code , language ,questionId);
    await runCode({code  , language , setOutput , questionId});
  }
  return (
    <>

      <LanguageSelect
        language={language}
        setLanguage={setLanguage}
      />

      <button
        onClick={runHandle}
        className='run-btn'
      >Run</button>

      <CodeEditor
        language={language}
        code={code}
        setCode={setCode}
      />

      <pre className="terminal" >{output}</pre>

    </>
  )
}

export default App
