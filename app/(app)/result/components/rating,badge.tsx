import { Badge } from '@heroui/react';
import React from 'react';

type BadgeColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

interface BadgeStyle {
  color: BadgeColor;
  text: string;
}

const getBadgeStyle = (percent: number): BadgeStyle => {
  if (percent <= 25) {
    return { color: 'danger', text: 'Low' };
  } else if (percent <= 50) {
    return { color: 'warning', text: 'Avg' };
  } else if (percent <= 75) {
    return { color: 'secondary', text: 'Good' };
  } else {
    return { color: 'success', text: 'Best' };
  }
};

interface RatingBadgesProps {
  weight: number;
  children?: React.ReactNode;
}

const RatingBadges: React.FC<RatingBadgesProps> = ({ weight, children }) => {
  const { color, text } = getBadgeStyle(weight);

  return (
    <Badge size="sm" color={color} variant="flat" content={text}>
      {children}
    </Badge>
  );
};

export default RatingBadges;
