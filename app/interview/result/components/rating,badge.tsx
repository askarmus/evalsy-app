import { Chip } from "@heroui/react";
import React from "react";

const getBadgeStyle = (percent: number) => {
  if (percent <= 25) {
    return { bgColor: "bg-orange-500", text: "Below Average" };
  } else if (percent > 25 && percent <= 50) {
    return { bgColor: "bg-yellow-500", text: "Average" };
  } else if (percent > 50 && percent <= 75) {
    return { bgColor: "bg-blue-500", text: "Good" };
  } else if (percent > 75) {
    return { bgColor: "bg-green-500", text: "Excellent" };
  }

  return { bgColor: "bg-gray-500", text: "Unknown" };
};

const RatingBadge = ({ weight }) => {
  const { bgColor, text } = getBadgeStyle(weight);

  return (
    <Chip
      color='primary'
      classNames={{
        base: `${bgColor} text-white font-sm`,
      }}
      size='sm'
      variant='flat'>
      {text}
    </Chip>
  );
};

export default RatingBadge;
