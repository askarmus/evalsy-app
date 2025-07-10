import { HiringGradeUtil } from '@/app/utils/hiring-grade.util';
import { Badge, Tooltip } from '@heroui/react';
import React from 'react';

interface RatingBadgesProps {
  weight: number;
  children?: React.ReactNode;
  useTechnicalGrading?: boolean; // Optional flag for stricter assessments
}

const RatingBadges: React.FC<RatingBadgesProps> = ({ weight, children, useTechnicalGrading = false }) => {
  const grade = useTechnicalGrading ? HiringGradeUtil.getTechnicalHiringGrade(weight) : HiringGradeUtil.getHiringRecommendation(weight);

  return (
    <Tooltip content={grade.recommendation || ''} placement="top">
      <Badge size="sm" color={grade.color} variant="flat" content={grade.text}>
        {children}
      </Badge>
    </Tooltip>
  );
};

export default RatingBadges;
