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

  return (
    <Card className='p-2 mb-6'>
      <CardBody>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            scales: {
              x: {
                grid: { display: true }, // Removes vertical grid lines
                ticks: { font: { size: 8 } }, // Reduces font size of X-axis labels
              },
              y: {
                beginAtZero: false,
                min: 2.5, // Start from 2.5
                max: 5,
                grid: { display: false }, // Removes horizontal grid lines
                ticks: { font: { size: 8 } }, // Reduces font size of Y-axis labels
              },
            },
            plugins: {
              legend: {
                display: false,
                labels: {
                  font: { size: 12 }, // Reduces font size of the legend
                },
              },
              title: {
                display: false,
                text: "Evaluation Chart", // Custom chart title
                font: { size: 14 }, // Reduces title font size
              },
            },
          }}
        />
      </CardBody>
    </Card>
  );
};

export default EvaluationChart;
