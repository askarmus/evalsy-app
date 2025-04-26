import React from "react";

const ratings = [
  { range: "0% - 25%", label: "Below Average", color: "bg-orange-500" },
  { range: "26% - 50%", label: "Average", color: "bg-yellow-500" },
  { range: "51% - 75%", label: "Good", color: "bg-blue-500" },
  { range: "76% - 100%", label: "Excellent", color: "bg-green-500" },
];

const RatingLegend: React.FC = () => {
  return (
    <div className='flex flex-wrap justify-center mt-6 gap-4 mb-5'>
      {ratings.map((rating, index) => (
        <div key={index} className='flex items-center gap-2'>
          <span className={`w-2 h-2 ${rating.color} rounded-full`}></span>
          <span className='text-[10px] '>{`${rating.label} (${rating.range})`}</span>
        </div>
      ))}
    </div>
  );
};

export default RatingLegend;
