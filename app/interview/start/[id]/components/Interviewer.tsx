import React from "react";

const Interviewer: React.FC<any> = ({ data }) => {
  return (
    <div className='space-y-3'>
      <h3 className='font-medium text-sm'>REVIEWER</h3>
      <div className='flex items-center gap-3'>
        <div className='flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border border-gray-300'>
          <img src={data?.photoUrl} alt={data?.name || "Reviewer"} className='w-full h-full object-cover' />
        </div>

        <div>
          <p className='font-medium'>{data?.name}</p>
          <p className='text-sm text-muted-foreground'>Senior Developer • BCS Technology</p>
        </div>
      </div>
    </div>
  );
};

export default Interviewer;
