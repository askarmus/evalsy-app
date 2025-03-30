import { Card, CardBody } from "@heroui/react";
import React from "react";
import { Bar } from "react-chartjs-2";

const EvaluationChart = ({ data }) => {
  const categories = ["relevance", "completeness", "clarity", "grammar_language", "technical_accuracy"];

  const colors = [
    "rgba(255, 99, 132, 0.6)", // Red
    "rgba(54, 162, 235, 0.6)", // Blue
    "rgba(255, 206, 86, 0.6)", // Yellow
    "rgba(75, 192, 192, 0.6)", // Green
    "rgba(153, 102, 255, 0.6)", // Purple
  ];

  const borderColors = ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)"];

  const chartData = {
    labels: categories.map((category) => category.replace("_", " ").toUpperCase()),
    datasets: [
      {
        label: "Evaluation Scores",
        data: categories.map((category) => data.questionAnswers.reduce((sum, answer) => sum + (answer.evaluation.scores[category] || 0), 0) / data.questionAnswers.length),
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 1,
        barThickness: 30, // Adjusted for thinner bars
      },
    ],
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 4) return "bg-green-500";
    if (score >= 3) return "bg-blue-500";
    if (score >= 2) return "bg-yellow-500";
    return "bg-red-500";
  };

  const evaluationScores = {
    relevance: 3,
    completeness: 2,
    clarity: 4,
    grammar_language: 5,
    technical_accuracy: 2,
  };
  return (
    <Card shadow='sm' className='p-2 mb-6'>
      <CardBody>
        <div className='space-y-2'>
          {Object.entries(evaluationScores).map(([key, value]) => (
            <div key={key} className='grid grid-cols-12 gap-2 items-center'>
              <span className='col-span-5 text-xs capitalize  '>{key.replace("_", " ")}:</span>
              <div className='col-span-5'>
                <div className='h-2 w-full rounded-full  '>
                  <div className={`h-2 rounded-full ${getScoreBarColor(value)}`} style={{ width: `${(value / 5) * 100}%` }}></div>
                </div>
              </div>
              <span className='col-span-2 text-right text-xs font-medium  '>{value}/5</span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default EvaluationChart;
