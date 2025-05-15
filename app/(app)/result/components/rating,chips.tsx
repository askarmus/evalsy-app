import { Chip } from '@heroui/react';
import React from 'react';

// Define allowed chip colors from HeroUI
type ChipColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

interface BadgeStyle {
  color: ChipColor;
  text: string;
}

// Determine color and label based on weight
const getBadgeStyle = (percent: number): BadgeStyle => {
  if (percent <= 25) {
    return { color: 'danger', text: 'Low' };
  } else if (percent <= 50) {
    return { color: 'warning', text: 'Average' };
  } else if (percent <= 75) {
    return { color: 'secondary', text: 'Good' };
  } else if (percent > 75) {
    return { color: 'success', text: 'Best' };
  }
  return { color: 'default', text: 'Default' };
};

interface RatingChipsProps {
  weight: number;
}

const RatingChips: React.FC<RatingChipsProps> = ({ weight }) => {
  const { color, text } = getBadgeStyle(weight);

  return (
    <Chip size="sm" color={color} variant="solid">
      {text}
    </Chip>
  );
};

export default RatingChips;
