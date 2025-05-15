'use client';
import React from 'react';
import { Card, CardBody } from '@heroui/react';

interface FeedbackCardProps {
  summary?: string[];
}

export default function FeedbackCard({ summary = [] }: FeedbackCardProps) {
  const validFeedback = summary.filter((item) => item.trim() !== '');

  if (!validFeedback.length) return null;

  return (
    <div className="rounded-xl border border-slate-200 p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Feedback</h2>
      <div className="p-2 mt-6 w-full">
        <ul className="space-y-3">
          {validFeedback.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="mt-2 w-2 h-2 rounded-full shrink-0 bg-gray-400" />
              <span className="text-sm leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
