import React from "react";

export const EducationAndSoftSkills: React.FC<{ education: any; soft_skills: any }> = ({ education, soft_skills }) => (
  <section className='bg-white p-6 shadow rounded-xl'>
    <h3 className='font-medium mb-3'>Education</h3>
    <dl className='divide-y divide-gray-200'>
      <div className='py-3 flex justify-between'>
        <dt className='text-sm font-medium'>Highest Degree</dt>
        <dd className='text-sm'>{education.highest_degree}</dd>
      </div>
      <div className='py-3 flex justify-between'>
        <dt className='text-sm font-medium'>Relevant Field</dt>
        <dd className='text-sm'>{education.relevant_field ? "Yes" : "No"}</dd>
      </div>
      <div className='py-3 flex justify-between'>
        <dt className='text-sm font-medium'>Certifications</dt>
        <dd className='text-sm'>{education.certifications.length ? education.certifications.join(", ") : "None"}</dd>
      </div>
    </dl>
    <h3 className='font-medium mb-3 mt-6'>Soft Skills</h3>
    <div className='flex flex-wrap gap-2 mb-2'>
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${soft_skills.leadership_experience ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>Leadership</span>
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${soft_skills.communication_strength === "strong" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>Communication: {soft_skills.communication_strength}</span>
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${soft_skills.teamwork ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>Teamwork</span>
    </div>
  </section>
);
