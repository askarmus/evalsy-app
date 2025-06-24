import React from 'react';

export const TopSkillsSection: React.FC<{ skill_experience: any[] }> = ({ skill_experience }) => (
  <section className=" ">
    <h2 className="text-md font-semibold mb-1 text-green-700">Top Skills</h2>
    {skill_experience.map((skill, index) => (
      <div key={index}>
        <div className="flex justify-between mb-1">
          <span className="font-medium">{skill.skill}</span>
          <span className="text-sm">{skill.experience}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
          <div className="bg-green-700 h-1 rounded-full w-full"></div>
        </div>
        <p className="text-xs mt-1">Last used: {skill.last_used}</p>
      </div>
    ))}
  </section>
);
