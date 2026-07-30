import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";

interface CodeEditorProps {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  language: string;
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

export function CodeEditor({ code, setCode, language }: CodeEditorProps) {
  const [editorTheme, setEditorTheme] = useState("vs-dark");

  useEffect(() => {
    setCode(boilerplates[language || "cpp"]);
  }, [language, setCode]);

  useEffect(() => {
    // Sync theme
    const currentTheme = document.documentElement.getAttribute("data-theme");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEditorTheme(currentTheme === "light" ? "light" : "vs-dark");

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "data-theme") {
          const updatedTheme = document.documentElement.getAttribute("data-theme");
          setEditorTheme(updatedTheme === "light" ? "light" : "vs-dark");
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Editor
        height="100%"
        width="100%"
        language={language || "cpp"}
        theme={editorTheme}
        value={code}
        onChange={(value) => setCode(value || "")}
        options={{
          fontSize: 15,         
          fontFamily: "JetBrains Mono, Fira Code, monospace",
          lineHeight: 22,
          minimap: { enabled: false },
          wordWrap: "on",
          automaticLayout: true,
          padding: { top: 12, bottom: 12 }
        }}
      />
    </>
  );
}
