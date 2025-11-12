'use client';

import React from 'react';
import { Card, CardBody, CardHeader, CardFooter, Divider, Progress, Tooltip, Chip } from '@heroui/react';
import { CheckCircle, AlertTriangle, XCircle, MessageSquare } from 'lucide-react';

// -----------------------------
// 🧩 Type Definitions
// -----------------------------
interface AssessmentItem {
  question: string;
  score: number; // value between 0–100 (percentage)
  answerSummary: string;
  comment: string;
}

interface QuestionResponsesProps {
  assessmentData: AssessmentItem[];
}

// -----------------------------
// 🎯 Helper Functions
// -----------------------------
function getStatusIcon(score: number) {
  if (score >= 85)
    return (
      <Tooltip content="Excellent">
        <CheckCircle className="text-success w-5 h-5" />
      </Tooltip>
    );
  if (score >= 60)
    return (
      <Tooltip content="Good">
        <AlertTriangle className="text-warning w-5 h-5" />
      </Tooltip>
    );
  return (
    <Tooltip content="Needs Improvement">
      <XCircle className="text-danger w-5 h-5" />
    </Tooltip>
  );
}

function getScoreBadge(score: number) {
  if (score >= 85) return { label: 'Excellent', color: 'success' as const };
  if (score >= 70) return { label: 'Good', color: 'secondary' as const };
  if (score >= 50) return { label: 'Average', color: 'warning' as const };
  return { label: 'Poor', color: 'danger' as const };
}

// -----------------------------
// 🧠 Component
// -----------------------------
export function QuestionResponses({ assessmentData }: QuestionResponsesProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground mb-4"></h2>
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-secondary-100 rounded-full p-2 flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-secondary-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Question Responses</h3>
      </div>
      {assessmentData.map((item, index) => {
        const badge = getScoreBadge(item.score);

        return (
          <Card key={index} shadow="sm" className="border border-divider bg-content1 hover:border-primary/60 transition-all">
            <CardHeader className="flex justify-between items-start pb-0">
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-muted bg-default-100 px-2 py-0.5 rounded">Q{index + 1}</span>
                  {getStatusIcon(item.score)}
                </div>
                <h3 className="font-medium text-base text-foreground">{item.question}</h3>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">{item.score}%</div>
                <p className="text-xs text-default-500">Score</p>
              </div>
            </CardHeader>

            <Divider className="my-3" />

            <CardBody className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-semibold text-default-500 mb-1">Answer Summary</p>
                <p className="text-default-700">{item.answerSummary}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-default-500 mb-1">Feedback</p>
                <p className="text-default-700">{item.comment}</p>
              </div>
            </CardBody>

            <CardFooter className="flex flex-col gap-2 pt-0">
              <div className="flex justify-between items-center w-full">
                <p className="text-xs font-semibold text-default-500">Performance</p>
                <Chip color={badge.color} size="sm" variant="flat">
                  {badge.label}
                </Chip>
              </div>
              <Progress size="sm" color={badge.color} value={item.score} aria-label={`Score ${item.score}%`} />
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
