import type React from "react";

interface LanguageSelectProps{
  language : string , 
  setLanguage : React.Dispatch<React.SetStateAction<string>>;
}

const languages = [
  "cpp",
  "javascript",
  "python",
  "java",
];


function LanguageSelect({ language , setLanguage} : LanguageSelectProps) {
  return (
    <select value={language} onChange={(e) => setLanguage(e.target.value)}>

      {languages.map((lang) => (
        <option key={lang} value={lang}>
          {lang.toUpperCase()}
        </option>
      ))}
    </select>
  );
}

export default LanguageSelect;