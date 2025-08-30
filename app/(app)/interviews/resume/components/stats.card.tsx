import { Card } from '@heroui/react';
import { BarChart3, Star, Users, UserX } from 'lucide-react';

const iconMap = {
  totalCandidates: <Users className="h-6 w-6 text-purple-600" />,
  avgMatchScore: <BarChart3 className="h-6 w-6 text-purple-600" />,
  topCandidatesPercent: <Star className="h-6 w-6 text-purple-600" />,
  rejectedCandidates: <UserX className="h-6 w-6 text-purple-600" />,
};

export default function ResumeStatsGrid({ resumeStats }: any) {
  const cards = [
    {
      key: 'totalCandidates',
      title: 'Candidates',
      value: resumeStats.totalCandidates,
      percentage: null,
      subtitle: 'Profiles checked',
    },
    {
      key: 'avgMatchScore',
      title: 'Avg Score',
      value: `${resumeStats.avgMatchScore || 0}%`,
      percentage: null,
      subtitle: 'Overall average',
    },
    {
      key: 'topCandidatesPercent',
      title: `Top`,
      value: `${resumeStats.topCandidatesPercent}%`,
      percentage: resumeStats.topCandidatesPercent,
      subtitle: 'Above 75% score',
    },
    {
      key: 'rejectedCandidates',
      title: `Rejected ${resumeStats.rejectedCandidatesPercent}%`,
      value: resumeStats.rejectedCandidates,
      percentage: resumeStats.rejectedCandidatesPercent,
      subtitle: 'Below 50% score',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {cards.map((card, idx) => (
        <Card key={idx} className=" " radius="sm" shadow="sm">
          <div className="flex items-center p-3">
            <div className="p-2 bg-purple-100 rounded-lg mr-5">{iconMap[card.key as keyof typeof iconMap]}</div>
            <div className="min-w-0">
              <div className="text-[20px] font-medium   truncate">{card.title}</div>
              <div className="flex items-baseline">
                <span className="text-xl font-bold mr-2">{card.value}</span>
                <span className="text-xs   truncate">{card.subtitle}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
