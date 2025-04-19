import { Card, CardBody, CardHeader } from "@heroui/react";
import { FaUsers, FaChartLine, FaStar, FaUserSlash } from "react-icons/fa";

type Props = {
  resumeStats: {
    totalCandidates: number;
    avgMatchScore: number;
    topCandidatesPercent: number;
    rejectedCandidates: number;
  };
};

export default function ResumeStatsGrid({ resumeStats }: Props) {
  const cards = [
    {
      title: "Total Candidates",
      value: resumeStats.totalCandidates,
      icon: <FaUsers className='h-5 w-5 text-sky-500 dark:text-sky-400' />,
      subtitle: "Profiles evaluated",
      valueClass: "text-sky-500 dark:text-sky-400",
    },
    {
      title: "Average Match Score",
      value: `${resumeStats.avgMatchScore || 0}%`,
      icon: <FaChartLine className='h-5 w-5 text-teal-500 dark:text-teal-400' />,
      subtitle: "Average score across all candidates",
      valueClass: "text-teal-500 dark:text-teal-400",
    },
    {
      title: "Top Candidates",
      value: `${resumeStats.topCandidatesPercent}%`,
      icon: <FaStar className='h-5 w-5 text-amber-500 dark:text-amber-400' />,
      subtitle: "Candidates scoring above 85%",
      valueClass: "text-amber-500 dark:text-amber-400",
    },
    {
      title: "Rejected Candidates",
      value: resumeStats.rejectedCandidates,
      icon: <FaUserSlash className='h-5 w-5 text-rose-500 dark:text-rose-400' />,
      subtitle: "Rejected due to low match score below 35%",
      valueClass: "text-rose-500 dark:text-rose-400",
    },
  ];

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {cards.map((card, idx) => (
        <Card shadow='sm' radius='sm' key={idx} className='border bg-white dark:bg-gray-950 shadow-sm hover:shadow-md transition-all'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <h1 className='text-xl font-medium text-gray-700 dark:text-gray-200'>{card.title}</h1>
            {card.icon}
          </CardHeader>
          <CardBody>
            <div className={`text-2xl font-bold ${card.valueClass}`}>{card.value}</div>
            {card.subtitle && <p className='text-xs text-gray-500 dark:text-gray-400'>{card.subtitle}</p>}
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
