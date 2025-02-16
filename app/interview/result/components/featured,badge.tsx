import React from "react";

const getBadgeStyle = (weight) => {
  if (weight >= 0 && weight <= 0.9) {
    return { bgColor: "bg-red-200", text: "Poor" };
  } else if (weight >= 1 && weight <= 1.9) {
    return { bgColor: "bg-orange-500", text: "Below Average" };
  } else if (weight >= 2 && weight <= 2.9) {
    return { bgColor: "bg-yellow-500", text: "Average" };
  } else if (weight >= 3 && weight <= 3.9) {
    return { bgColor: "bg-blue-500", text: "Good" };
  } else if (weight >= 4 && weight <= 5) {
    return { bgColor: "bg-green-500", text: "Excellent" };
  }
  return { bgColor: "bg-gray-500", text: "Unknown" }; // Default case
};

const FeaturedBadge = ({ weight }) => {
  const { bgColor, text } = getBadgeStyle(weight);

  return <p className={`px-4 py-1 text-sm text-white rounded-tl-lg rounded-br-xl w-fit ${bgColor}`}>{text}</p>;
};

export default FeaturedBadge;
