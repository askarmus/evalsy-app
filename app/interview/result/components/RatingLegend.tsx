import React from "react";

const ratings = [
  { range: "1 - 7.5", label: "Below Average", color: "bg-orange-500" },
  { range: "7.6 - 15", label: "Average", color: "bg-yellow-500" },
  { range: "15.1 - 22.5", label: "Good", color: "bg-blue-500" },
  { range: "22.6 - 30", label: "Excellent", color: "bg-green-500" },
];

const RatingLegend: React.FC = () => {
  return (
    <div className='flex flex-wrap justify-center mt-6 gap-4 mb-5'>
      {ratings.map((rating, index) => (
        <div key={index} className='flex items-center gap-2'>
          <span className={`w-4 h-4 ${rating.color} rounded-full`}></span>
          <span className='text-sm font-medium'>{`${rating.label} (${rating.range})`}</span>
        </div>
      ))}
    </div>
  );
};

export default RatingLegend;
