"use client";

import { useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";

import { languages } from "@/config/languages";
import { executeCode } from "@/app/utils/judge0";
import { Button } from "@heroui/react";
import { FaExpand, FaPlay } from "react-icons/fa";

export default function TerminalRunner({ onOutput, language }: { onOutput?: (output: string) => void; language: string }) {
  const [code, setCode] = useState<string>(languages[0].starterCode);
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);

  const handleRun = async () => {
    setLoading(true);
    try {
      const result = await executeCode(code, 63);
      setOutput(result.stdout || result.stderr || "No output.");
      onOutput?.(output);
    } catch (error) {
      setOutput("Error executing code.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && editorRef.current) {
      editorRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div className='mt-5'>
      <div className='flex justify-between items-center w-full'>
        <Button size='sm' color='success' onPress={handleRun} startContent={<FaPlay />} isLoading={loading}>
          {loading ? "Running..." : "Run"}
        </Button>

        <Button size='sm' color='secondary' startContent={<FaExpand />} onPress={toggleFullscreen}>
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </Button>
      </div>
      <div className='mt-2'>
        <Editor height={200} language={language} value={code} onChange={(value) => setCode(value || "")} theme='vs-dark' />
      </div>
    </div>
  );
}
