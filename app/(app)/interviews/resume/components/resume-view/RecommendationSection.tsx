import { HiringGradeUtil } from '@/app/utils/hiring-grade.util';
import React from 'react';

export const RecommendationSection: React.FC<{ job_match: any; decision_summary: any }> = ({ job_match, decision_summary }) => {
  const { color, label } = HiringGradeUtil.getResumeRecommendationStyle(decision_summary.hire_recommendation);
  return (
    <section className="   ">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1">
          <h2 className="text-xl font-medium mb-4 text-green-700">Hiring Rec.</h2>
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Job Match: {job_match.match_percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div className="bg-blue-600 h-1 rounded-full" style={{ width: `${job_match.match_percentage}%` }}></div>
            </div>
          </div>
          <p className="text-sm">{decision_summary.summary_reasoning}</p>
        </div>
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 rounded-full flex flex-col items-center justify-center ${color}`}>
            <span className="text-white text-xs font-bold">{job_match.match_percentage}%</span>
          </div>
        </div>
      </div>
    </section>
  );
};
