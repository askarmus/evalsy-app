import { Chip } from "@heroui/react";
import React from "react";

const getBadgeStyle = (percent: number) => {
  if (percent <= 25) {
    return { textColor: "text-orange-400", text: "Low" };
  } else if (percent > 25 && percent <= 50) {
    return { textColor: "text-yellow-400", text: "Avg" };
  } else if (percent > 50 && percent <= 75) {
    return { textColor: "text-blue-400", text: "Good" };
  } else if (percent > 75) {
    return { textColor: "text-green-400", text: "Best" };
  }

  return { textColor: "bg-gray-400", text: "Unknown" };
};

const RatingBadge = ({ weight }) => {
  const { textColor, text } = getBadgeStyle(weight);

  return (
    <Chip size='sm' color='default' variant='bordered' className={textColor}>
      {text}
    </Chip>
  );
};

export default RatingBadge;
