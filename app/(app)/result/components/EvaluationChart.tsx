import { Card, CardBody } from "@heroui/react";
import React from "react";

const EvaluationChart = ({ data }: { data: any }) => {
  const categories: (keyof any)[] = ["relevance", "completeness", "clarity", "grammar_language", "technical_accuracy"];

  // Calculate average scores from all answers
  const averageScores: Record<string, number> = categories.reduce((acc: any, category: any) => {
    const total = data.questionAnswers.reduce((sum, answer) => sum + (answer.evaluation?.scores[category] || 0), 0);
    const avg = total / data.questionAnswers.length;
    acc[category] = avg;
    return acc;
  }, {} as Record<string, number>);

  // Determine bar color based on score
  const getScoreBarColor = (score: number) => {
    if (score >= 4) return "bg-green-500";
    if (score >= 3) return "bg-blue-500";
    if (score >= 2) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card shadow='sm' className='p-2 mb-6'>
      <CardBody>
        <div className='space-y-2'>
          {Object.entries(averageScores).map(([key, value]) => {
            const score = value as number;
            return (
              <div key={key} className='grid grid-cols-12 gap-2 items-center'>
                <span className='col-span-5 text-xs capitalize'>{key.replace("_", " ")}:</span>
                <div className='col-span-5'>
                  <div className='h-2 w-full rounded-full bg-gray-200'>
                    <div className={`h-2 rounded-full ${getScoreBarColor(score)}`} style={{ width: `${(score / 5) * 100}%` }}></div>
                  </div>
                </div>
                <span className='col-span-2 text-right text-xs font-medium'>{score.toFixed(1)}/5</span>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};

export default EvaluationChart;
