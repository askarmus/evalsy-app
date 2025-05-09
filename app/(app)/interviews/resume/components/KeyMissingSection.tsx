import React from "react";

const getSeverityBadge = (severity: string) => {
  const map = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-blue-100 text-blue-800",
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${map[severity] || "bg-gray-100 text-gray-800"}`}>{severity.charAt(0).toUpperCase() + severity.slice(1)}</span>;
};

export const KeyMissingSection: React.FC<{ key_missing: any[] }> = ({ key_missing }) => (
  <section className='bg-white p-6 shadow rounded-xl'>
    <h3 className='text-lg font-medium mb-4 flex items-center gap-2'>Key Missing</h3>
    <div className='space-y-4'>
      {key_missing.map((missing, index) => (
        <div key={index} className='border-b border-gray-200 pb-4 last:border-0 last:pb-0'>
          <div className='flex justify-between mb-1'>
            <h4 className='font-medium'>{missing.requirement}</h4>
            {getSeverityBadge(missing.severity)}
          </div>
        </div>
      ))}
    </div>
  </section>
);
