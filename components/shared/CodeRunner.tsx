"use client";

import { useState } from "react";
import { Editor } from "@monaco-editor/react";

import { languages } from "@/config/languages"; // <<< imported
import { executeCode } from "@/app/utils/judge0";

export default function TerminalRunner() {
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const [code, setCode] = useState<string>(languages[0].starterCode);
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRun = async () => {
    setLoading(true);
    try {
      const result = await executeCode(code, selectedLang.id);
      setOutput(result.stdout || result.stderr || "No output.");
    } catch (error) {
      setOutput("Error executing code.");
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (langLabel: string) => {
    const lang = languages.find((l) => l.label === langLabel);
    if (lang) {
      setSelectedLang(lang);
      setCode(lang.starterCode);
    }
  };

  return (
    <div className='flex flex-col w-full h-screen p-4 gap-4 bg-gray-950'>
      {/* Language Dropdown + Run */}
      <div className='flex items-center gap-4'>
        <select value={selectedLang.label} onChange={(e) => handleLanguageChange(e.target.value)} className='bg-gray-800 text-white p-2 rounded-lg border border-gray-600'>
          {languages.map((lang) => (
            <option key={lang.id} value={lang.label}>
              {lang.label}
            </option>
          ))}
        </select>

        <button onClick={handleRun} className='bg-green-600 hover:bg-green-700 transition text-white font-bold py-2 px-6 rounded-lg'>
          {loading ? "Running..." : "Run Code"}
        </button>
      </div>

      {/* Monaco Editor */}
      <div className='flex-1 rounded-xl overflow-hidden border border-gray-700'>
        <Editor height='100%' language={selectedLang.monacoLang} value={code} onChange={(value) => setCode(value || "")} theme='vs-dark' />
      </div>

      {/* Terminal Output */}
      <div className='flex-1 bg-black text-green-400 p-4 rounded-xl overflow-y-auto font-mono min-h-[200px]'>
        <pre>{output}</pre>
      </div>
    </div>
  );
}
