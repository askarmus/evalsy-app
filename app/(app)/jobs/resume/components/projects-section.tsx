import { FaFolder } from "react-icons/fa";

interface ProjectsSectionProps {
  projects: string[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <div>
      <h2 className='text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700'>Projects</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {projects.map((project, index) => (
          <div key={index} className='flex items-start gap-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-md border border-gray-100 dark:border-gray-700'>
            <FaFolder className='h-5 w-5  mt-0.5 flex-shrink-0' />
            <span className='text-gray-700 dark:text-gray-300'>{project}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
