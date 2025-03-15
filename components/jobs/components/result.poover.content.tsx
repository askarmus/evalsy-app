import React from "react";

const ResultPopoverContent: React.FC<any> = ({ resume }) => {
  return (
    <div className='px-4 py-3 w-[350px]'>
      <div className='flex justify-between items-center mt-2'>
        <h2 className='text-sm font-bold'>Name:</h2>
        <p className='text-sm text-gray-500'>{resume?.analysis?.name || "N/A"}</p>
      </div>
      <div className='flex justify-between items-center mt-2'>
        <h2 className='text-sm font-bold'>Score:</h2>
        <p className='text-sm text-gray-500'>{resume?.analysis?.match_score ?? "N/A"}%</p>
      </div>
      <div className='flex justify-between items-center mt-2'>
        <h2 className='text-sm font-bold'>Email:</h2>
        <p className='text-sm text-gray-500'>{resume?.analysis?.email || "N/A"}</p>
      </div>
      <div className='flex justify-between items-center mt-2'>
        <h2 className='text-sm font-bold'>Phone:</h2>
        <p className='text-sm text-gray-500'>{resume?.analysis?.phone || "N/A"}</p>
      </div>
      <div className='flex justify-between items-center mt-2'>
        <h2 className='text-sm font-bold'>Total Experience:</h2>
        <p className='text-sm text-gray-500'>{resume?.analysis?.total_experience || "N/A"}</p>
      </div>
      <div className='flex justify-between items-center mt-2'>
        <h2 className='text-sm font-bold'>Relevant Experience:</h2>
        <p className='text-sm text-gray-500'>{resume?.analysis?.relevant_experience || "N/A"}</p>
      </div>

      <hr className='my-2' />
      <h2 className='text-sm font-bold mb-3'>Skills:</h2>
      <div className='text-xs flex flex-wrap gap-1'>
        {resume?.analysis?.skills && resume.analysis.skills.length > 0 ? (
          resume.analysis.skills.map((skill, index) => (
            <span key={index} className='bg-gray-200 text-gray-700 px-2 py-1 rounded-md'>
              {skill}
            </span>
          ))
        ) : (
          <p className='text-sm text-gray-500'>No skills available</p>
        )}
      </div>
    </div>
  );
};

export default ResultPopoverContent;
