'use client';

import { Card, CardBody, Chip } from '@heroui/react';

export default function SimpleScoreDisplay({ scores }: any) {
  const scoreValues = scores?.evaluation?.scores;

  const totalScore = [scoreValues?.relevance, scoreValues?.completeness, scoreValues?.clarity, scoreValues?.grammar_language, scoreValues?.technical_accuracy].filter((score) => typeof score === 'number').reduce((sum, val) => sum + val, 0);

  return (
    <Card radius="none" shadow="sm" className=" bg-gray-50">
      <CardBody>
        <div className="text-xs flex flex-row flex-wrap items-center gap-x-4 gap-y-1 bg-gray-50  ">
          <span>
            <span className="text-xs font-bold text-gray-500">Question Score</span>
          </span>

          <span>
            <span className="text-xs font-medium text-gray-500">Relevance:</span> {scoreValues?.relevance?.toFixed(1)}
          </span>
          <span>
            <span className="text-xs font-medium text-gray-500">Completeness:</span> {scoreValues?.completeness?.toFixed(1)}
          </span>
          <span>
            <span className="text-xs font-medium text-gray-500">Clarity:</span> {scoreValues?.clarity?.toFixed(1)}
          </span>
          <span>
            <span className="text-xs font-medium text-gray-500">Grammar & Language:</span> {scoreValues?.grammar_language?.toFixed(1)}
          </span>
          <span>
            <span className="text-xs font-medium text-gray-500">Technical Accuracy:</span> {scoreValues?.technical_accuracy?.toFixed(1)}
          </span>
          <span>
            <span className="text-xs font-bold  ">Total Score:</span> <Chip size="sm"> {totalScore.toFixed(1)}/25</Chip>
          </span>
        </div>
      </CardBody>
    </Card>
  );
}
