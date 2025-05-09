import { Card } from '@heroui/react';
import { FaUsers, FaStar, FaUserSlash, FaChartBar } from 'react-icons/fa';

type Props = {
  resumeStats: {
    totalCandidates: number;
    avgMatchScore: number;
    topCandidatesPercent: number;
    rejectedCandidates: number;
  };
};

const iconMap = {
  totalCandidates: <FaUsers className="h-6 w-6 text-sky-500 mr-4 flex-shrink-0" />,
  avgMatchScore: <FaChartBar className="h-6 w-6 text-teal-500 mr-4 flex-shrink-0" />,
  topCandidatesPercent: <FaStar className="h-6 w-6 text-amber-500 mr-4 flex-shrink-0" />,
  rejectedCandidates: <FaUserSlash className="h-6 w-6 text-rose-500 mr-4 flex-shrink-0" />,
};

export default function ResumeStatsGrid({ resumeStats }: Props) {
  const cards = [
    {
      key: 'totalCandidates',
      title: 'Total Candidates',
      value: resumeStats.totalCandidates,
      subtitle: 'Profiles evaluated',
    },
    {
      key: 'avgMatchScore',
      title: 'Average Match Score',
      value: `${resumeStats.avgMatchScore || 0}%`,
      subtitle: 'Average score across all candidates',
    },
    {
      key: 'topCandidatesPercent',
      title: 'Top Candidates',
      value: `${resumeStats.topCandidatesPercent}%`,
      subtitle: 'Candidates scoring above 85%',
    },
    {
      key: 'rejectedCandidates',
      title: 'Rejected Candidates',
      value: resumeStats.rejectedCandidates,
      subtitle: 'Rejected due to low match score below 35%',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {cards.map((card, idx) => (
        <Card key={idx} className="overflow-hidden" radius="sm" shadow="sm">
          <div className="flex items-center p-3">
            {iconMap[card.key as keyof typeof iconMap]}
            <div className="min-w-0">
              <div className="text-[18px] font-medium  mb-1  truncate">{card.title}</div>
              <div className="flex items-baseline">
                <span className="text-xl font-bold mr-1">{card.value}</span>
                <span className="text-xs text-slate-500 truncate">{card.subtitle}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
