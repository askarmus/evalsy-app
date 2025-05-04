"use client";

interface SimpleScoreDisplayProps {
  scores: {
    relevance: number;
    completeness: number;
    clarity: number;
    grammar_language: number;
    technical_accuracy: number;
  };
  totalScore: number;
}

export default function SimpleScoreDisplay({
  scores = {
    relevance: 4.2,
    completeness: 3.8,
    clarity: 4.5,
    grammar_language: 4.0,
    technical_accuracy: 4.3,
  },
  totalScore = 20.8,
}: SimpleScoreDisplayProps) {
  return (
    <div className='text-xs flex flex-wrap gap-x-3 gap-y-1 p-2 bg-gray-50 rounded border'>
      <span>
        <span className='font-bold'>Question Score</span>
      </span>

      <span>
        <span className='font-medium'>Relevance:</span> {scores.relevance.toFixed(1)}
      </span>
      <span>
        <span className='font-medium'>Completeness:</span> {scores.completeness.toFixed(1)}
      </span>
      <span>
        <span className='font-medium'>Clarity:</span> {scores.clarity.toFixed(1)}
      </span>
      <span>
        <span className='font-medium'>Grammar & Language:</span> {scores.grammar_language.toFixed(1)}
      </span>
      <span>
        <span className='font-medium'>Technical Accuracy:</span> {scores.technical_accuracy.toFixed(1)}
      </span>
      <span>
        <span className='font-medium'>Total Score:</span> {totalScore.toFixed(1)}/25
      </span>
    </div>
  );
}
