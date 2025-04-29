"use client";

import React, { useState } from "react";
import RichTextEditor from "@/components/shared/RichTextEditor";

interface Example {
  input: string;
  output: string;
  comment?: string;
}

interface CodingQuestion {
  title: string;
  constraints: string[];
  assumptions: string[];
  examples: Example[];
}

export default function EditableQuestions() {
  const [questions, setQuestions] = useState<CodingQuestion[]>([
    {
      title: "Write a function that returns index of first duplicate.",
      constraints: ["Input is always an array of integers.", "Return -1 if no duplicates."],
      assumptions: ["All integers are positive."],
      examples: [
        { input: "[2, 5, 1, 2, 3, 5]", output: "3", comment: "'2' is the first duplicate at index 3" },
        { input: "[1, 2, 3, 4]", output: "-1", comment: "No duplicates" },
      ],
    },
  ]);

  const updateTitle = (index: number, value: string) => {
    const updated = [...questions];
    updated[index].title = value;
    setQuestions(updated);
  };

  const updateConstraint = (qIndex: number, cIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].constraints[cIndex] = value;
    setQuestions(updated);
  };

  const updateAssumption = (qIndex: number, aIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].assumptions[aIndex] = value;
    setQuestions(updated);
  };

  const updateExample = (qIndex: number, eIndex: number, field: "input" | "output" | "comment", value: string) => {
    const updated = [...questions];
    updated[qIndex].examples[eIndex][field] = value;
    setQuestions(updated);
  };

  return (
    <div className='p-6 space-y-8'>
      {questions.map((q, qIndex) => (
        <div key={qIndex} className='bg-white shadow-lg rounded-2xl p-6 space-y-4'>
          {/* Title */}
          <div>
            <h2 className='text-lg font-semibold mb-2'>Title:</h2>
            <RichTextEditor value={q.title} onChange={(val) => updateTitle(qIndex, val)} />
          </div>

          {/* Constraints */}
          <div>
            <h3 className='text-md font-semibold mb-2'>Constraints:</h3>
            {q.constraints.map((c, cIndex) => (
              <input key={cIndex} className='border p-2 rounded w-full mb-2' value={c} onChange={(e) => updateConstraint(qIndex, cIndex, e.target.value)} placeholder='Constraint...' />
            ))}
          </div>

          {/* Assumptions */}
          <div>
            <h3 className='text-md font-semibold mb-2'>Assumptions:</h3>
            {q.assumptions.map((a, aIndex) => (
              <input key={aIndex} className='border p-2 rounded w-full mb-2' value={a} onChange={(e) => updateAssumption(qIndex, aIndex, e.target.value)} placeholder='Assumption...' />
            ))}
          </div>

          {/* Examples */}
          <div>
            <h3 className='text-md font-semibold mb-2'>Examples:</h3>
            {q.examples.map((ex, eIndex) => (
              <div key={eIndex} className='space-y-2 mb-4'>
                <input className='border p-2 rounded w-full' placeholder='Input...' value={ex.input} onChange={(e) => updateExample(qIndex, eIndex, "input", e.target.value)} />
                <input className='border p-2 rounded w-full' placeholder='Output...' value={ex.output} onChange={(e) => updateExample(qIndex, eIndex, "output", e.target.value)} />
                <input className='border p-2 rounded w-full' placeholder='Comment...' value={ex.comment || ""} onChange={(e) => updateExample(qIndex, eIndex, "comment", e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
