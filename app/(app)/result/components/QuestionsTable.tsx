import React, { useState, useEffect } from 'react';

const QuestionsTable = ({ data, onSelect }) => {
  const [selectedId, setSelectedId] = useState<string | number | null>(null);

  useEffect(() => {
    if (data.questionAnswers.length > 0) {
      const firstId = data.questionAnswers[0].id;
      setSelectedId(firstId);
      onSelect?.(data.questionAnswers[0]);
    }
  }, [data]);

  const handleClick = (answer) => {
    setSelectedId(answer.id);
    onSelect?.(answer);
  };

  return (
    <ul className="list-none max-h-[250px] overflow-y-auto pr-2">
      {data.questionAnswers.map((answer, index) => {
        const isSelected = selectedId === answer.id;
        return (
          <li key={answer.id || `question-${index}`} className="rounded-lg group cursor-pointer" onClick={() => handleClick(answer)}>
            <div className="flex flex-row">
              <div className="items-center flex flex-col justify-around">
                <div className="border-l-2 h-full border-gray-400"></div>
                <div className={`${!answer.transcription ? 'bg-red-500' : ' bg-green-400'} border-2 border-gray-400 rounded-full h-4 w-4 flex flex-grow justify-around`}>
                  <svg className="flex-none m-2 w-4 h-4 opacity-0 group-hover:opacity-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <div className="border-l-2 h-full border-gray-400"></div>
              </div>
              <div className="flex flex-col group-hover:bg-white ml-1 p-2 pr-6 rounded-xl">
                <div className={`ml-4 text-sm ${isSelected ? 'font-semibold' : ''} ${!answer.transcription ? 'text-red-500 underline line-through' : ''}`}>{answer.text}</div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default QuestionsTable;
