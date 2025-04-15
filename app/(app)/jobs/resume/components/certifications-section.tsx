import { FaAward } from "react-icons/fa";

interface CertificationsSectionProps {
  certifications: string[];
}

export function CertificationsSection({ certifications }: CertificationsSectionProps) {
  return (
    <div className='mb-8'>
      <h2 className='text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700'>Certifications</h2>

      <ul className='space-y-2'>
        {certifications.map((certification, index) => (
          <li key={index} className='flex items-start gap-2'>
            <FaAward className='h-5 w-5   mt-0.5 flex-shrink-0' />
            <span className='text-gray-700 dark:text-gray-300'>{certification}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
