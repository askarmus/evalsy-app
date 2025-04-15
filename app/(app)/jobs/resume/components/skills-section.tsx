interface SkillsSectionProps {
  skills: string[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <div className='mb-8'>
      <h2 className='text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700'>Skills</h2>

      <div className='flex flex-wrap gap-2'>
        {skills.map((skill, index) => (
          <span key={index} className='bg-gray-100 text-gray-800 dark:bg-blue-900 dark:text-blue-100 text-sm font-medium px-3 py-1 rounded-full'>
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
