import React from "react";

const getConfidenceBadge = (confidence: string) => {
  const map = {
    high: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-red-100 text-red-800",
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${map[confidence] || "bg-gray-100 text-gray-800"}`}>{confidence.charAt(0).toUpperCase() + confidence.slice(1)}</span>;
};

export const KeyMatchesSection: React.FC<{ key_matches: any[] }> = ({ key_matches }) => (
  <section className='bg-white shadow rounded-xl p-6'>
    <h3 className='text-lg font-medium mb-4 flex items-center gap-2'>Key Matches</h3>
    <div className='space-y-4'>
      {key_matches.map((match, index) => (
        <div key={index} className='border-b border-gray-200 pb-4 last:border-0 last:pb-0'>
          <div className='flex justify-between mb-1'>
            <h4 className='font-medium'>{match.requirement}</h4>
            {getConfidenceBadge(match.confidence)}
          </div>
          <p className='text-sm'>{match.match}</p>
        </div>
      ))}
    </div>
  </section>
);
