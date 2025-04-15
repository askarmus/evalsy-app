"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import { FaUsers, FaChartLine, FaStar, FaUserSlash } from "react-icons/fa";

interface ResumeStats {
  totalCandidates: number;
  avgMatchScore: number;
  topCandidatesPercent: number;
  rejectedCandidates: number;
}

interface Props {
  resumeStats: ResumeStats;
}

export default function ResumeStatsGrid({ resumeStats }: Props) {
  const cards = [
    {
      title: "Total Candidates",
      value: resumeStats.totalCandidates,
      icon: <FaUsers className='h-4 w-4 text-muted-foreground' />,
      subtitle: "Profiles evaluated",
    },
    {
      title: "Average Match Score",
      value: `${resumeStats.avgMatchScore || 0}%`,
      icon: <FaChartLine className='h-4 w-4 text-muted-foreground' />,
      subtitle: "Average score across all candidates",
    },
    {
      title: "Top Candidates",
      value: `${resumeStats.topCandidatesPercent}%`,
      icon: <FaStar className='h-4 w-4 text-muted-foreground' />,
      subtitle: "Candidates scoring above 85%",
    },
    {
      title: "Rejected Candidates",
      value: resumeStats.rejectedCandidates,
      icon: <FaUserSlash className='h-4 w-4 text-muted-foreground' />,
      subtitle: "Rejected due to low match score below 35%",
    },
  ];

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {cards.map((card, idx) => (
        <Card key={idx}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <h1 className='text-sm font-medium'>{card.title}</h1>
            {card.icon}
          </CardHeader>
          <CardBody>
            <div className='text-2xl font-bold'>{card.value}</div>
            {card.subtitle && <p className='text-xs text-muted-foreground'>{card.subtitle}</p>}
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
