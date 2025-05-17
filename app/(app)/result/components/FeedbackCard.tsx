'use client';
import React from 'react';

interface FeedbackCardProps {
  summary?: string[];
}

export default function FeedbackCard({ summary = [] }: FeedbackCardProps) {
  const validFeedback = summary?.filter((item) => item?.trim() !== '');

  return (
    <div>
      <h2 className="text-lg font-semibold  ">Feedback</h2>
      <div className="p-2   w-full">
        <ul className="space-y-3">
          {validFeedback.length > 0 ? (
            validFeedback.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-2 w-2 h-2 rounded-full shrink-0 bg-gray-400" />
                <span className="text-sm leading-relaxed">{item}</span>
              </li>
            ))
          ) : (
            <li className="text-sm text-gray-500">No feedback</li>
          )}
        </ul>
      </div>
    </div>
  );
}
