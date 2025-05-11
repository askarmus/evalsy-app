import React from "react";

export const RedFlagsSection: React.FC<{ red_flags: any }> = ({ red_flags }) => (
  <section className='bg-white p-6 shadow rounded-xl'>
    <h3 className='font-medium mb-3'>Red Flags</h3>
    <dl className='divide-y divide-gray-200'>
      <div className='py-2 flex justify-between'>
        <dt className='text-sm font-medium'>Employment Gaps</dt>
        <dd className='text-sm'>{red_flags.employment_gaps.length ? red_flags.employment_gaps.join(", ") : "None"}</dd>
      </div>
      <div className='py-2 flex justify-between'>
        <dt className='text-sm font-medium'>Short Tenures</dt>
        <dd className='text-sm'>{red_flags.short_tenures.length ? red_flags.short_tenures.join(", ") : "None"}</dd>
      </div>
      <div className='py-2 flex justify-between'>
        <dt className='text-sm font-medium'>Job Hopping</dt>
        <dd className='text-sm'>{red_flags.job_hopping ? "Yes" : "No"}</dd>
      </div>
    </dl>
  </section>
);
