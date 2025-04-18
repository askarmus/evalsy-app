import React from "react";

const getRecommendationStyle = (recommendation: string) => {
  const map = {
    strong: { color: "bg-green-500", label: "Strong Match" },
    weak: { color: "bg-red-500", label: "Weak Match" },
    conditional: { color: "bg-yellow-500", label: "Conditional Match" },
  };
  return map[recommendation] || { color: "bg-gray-500", label: "Unknown" };
};

export const RecommendationSection: React.FC<{ job_match: any; decision_summary: any }> = ({ job_match, decision_summary }) => {
  const { color, label } = getRecommendationStyle(decision_summary.hire_recommendation);
  return (
    <section className='bg-white p-6 shadow rounded-xl'>
      <div className='flex flex-col md:flex-row gap-8 items-center'>
        <div className='flex-1'>
          <h2 className='text-xl font-medium mb-4'>Hiring Recommendation</h2>
          <div className='mb-4'>
            <div className='flex justify-between mb-1'>
              <span className='text-sm font-medium'>Job Match: {job_match.match_percentage}%</span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-1'>
              <div className='bg-blue-600 h-1 rounded-full' style={{ width: `${job_match.match_percentage}%` }}></div>
            </div>
          </div>
          <p>{decision_summary.summary_reasoning}</p>
        </div>
        <div className='flex-shrink-0'>
          <div className={`w-24 h-24 rounded-full flex flex-col items-center justify-center ${color}`}>
            <span className='text-white text-lg font-bold'>{job_match.match_percentage}%</span>
            <span className='text-white text-xs font-medium'>{label}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
