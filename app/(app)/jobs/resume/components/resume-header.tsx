import { FaClock, FaMailchimp, FaPhone } from "react-icons/fa";

interface ResumeHeaderProps {
  name: string;
  email: string;
  phone: string;
  totalExperience: string;
  relevantExperience: string;
}

export function ResumeHeader({ name, email, phone, totalExperience, relevantExperience }: ResumeHeaderProps) {
  return (
    <div className='   p-8'>
      <h1 className='text-3xl md:text-4xl font-bold mb-2'>{name}</h1>

      <div className='flex flex-col md:flex-row md:items-center gap-4 mt-4'>
        <div className='flex items-center gap-2'>
          <FaMailchimp className='h-4 w-4' />
          <a href={`mailto:${email}`} className='hover:underline'>
            {email}
          </a>
        </div>

        <div className='flex items-center gap-2'>
          <FaPhone className='h-4 w-4' />
          <a href={`tel:${phone}`} className='hover:underline'>
            {phone}
          </a>
        </div>

        <div className='flex items-center gap-2'>
          <FaClock className='h-4 w-4' />
          <span>Total Experience: {totalExperience}</span>
        </div>

        <div className='flex items-center gap-2'>
          <FaClock className='h-4 w-4' />
          <span>Relevant Experience: {relevantExperience}</span>
        </div>
      </div>
    </div>
  );
}
