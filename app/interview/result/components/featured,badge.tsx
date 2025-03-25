import { Chip } from "@heroui/react";
import React from "react";

const getBadgeStyle = (weight) => {
  if (weight >= 1 && weight <= 7.5) {
    return { bgColor: "bg-orange-500", text: "Below Average" };
  } else if (weight >= 7.6 && weight <= 15) {
    return { bgColor: "bg-yellow-500", text: "Average" };
  } else if (weight >= 15.1 && weight <= 22.5) {
    return { bgColor: "bg-blue-500", text: "Good" };
  } else if (weight >= 22.6 && weight <= 30) {
    return { bgColor: "bg-green-500", text: "Excellent" };
  }
  return { bgColor: "bg-gray-500", text: "Unknown" }; // Default case
};

const FeaturedBadge = ({ weight }) => {
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

export default FeaturedBadge;
