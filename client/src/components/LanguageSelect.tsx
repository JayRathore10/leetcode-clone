import type React from "react";

interface LanguageSelectProps{
  language : string , 
  setLanguage : React.Dispatch<React.SetStateAction<string>>;
}

const languages = [
  "javascript",
  "typescript",
  "cpp",
  "python",
  "java",
  "json",
  "html",
  "css",
];


function LanguageSelect({ language , setLanguage} : LanguageSelectProps) {
  return (
    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
      <option value="">C++</option>

      {languages.map((lang) => (
        <option key={lang} value={lang}>
          {lang.toUpperCase()}
        </option>
      ))}
    </select>
  );
}

export default LanguageSelect;