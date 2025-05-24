import React from 'react';

const EvaluationChart = ({ data }: { data: any }) => {
  const getScoreBarColor = (score: number) => {
    if (score >= 40) return 'bg-green-500';
    if (score >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-2">
      {data?.categoryScores?.map(({ name, score, comment }) => {
        return (
          <div key={name} className="grid grid-cols-12 gap-2 items-center">
            <span className="col-span-5 text-xs capitalize">{name}:</span>
            <div className="col-span-5">
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className={`h-2 rounded-full ${getScoreBarColor(score)}`} style={{ width: score }}></div>
              </div>
            </div>
            <span className="col-span-2 text-right text-xs font-medium">{score}</span>
          </div>
        );
      })}
    </div>
  );
};

export default EvaluationChart;
