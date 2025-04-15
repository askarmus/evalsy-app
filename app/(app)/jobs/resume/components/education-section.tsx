import { FaGraduationCap } from "react-icons/fa";
interface Education {
  degree: string;
  university: string;
  year: string;
  additional_qualifications?: {
    degree: string;
    university: string;
    year: string;
  }[];
}

interface EducationSectionProps {
  education: Education;
}

export function EducationSection({ education }: EducationSectionProps) {
  return (
    <div className='mb-8'>
      <h2 className='text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700'>Education</h2>

      <div className='space-y-4'>
        <div className='flex gap-3'>
          <FaGraduationCap className='h-6 w-6   flex-shrink-0 mt-1' />
          <div>
            <h3 className='font-semibold text-lg text-gray-800 dark:text-gray-100'>{education.degree}</h3>
            <p className='text-gray-600 dark:text-gray-300'>{education.university}</p>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>Graduated: {education.year}</p>
          </div>
        </div>

        {education.additional_qualifications?.map((qual, index) => (
          <div key={index} className='flex gap-3'>
            <FaGraduationCap className='h-6 w-6   flex-shrink-0 mt-1' />
            <div>
              <h3 className='font-semibold text-lg text-gray-800 dark:text-gray-100'>{qual.degree}</h3>
              <p className='text-gray-600 dark:text-gray-300'>{qual.university}</p>
              <p className='text-gray-500 dark:text-gray-400 text-sm'>Graduated: {qual.year}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
