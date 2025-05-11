import React from "react";
import { FaClock, FaMap, FaPhone, FaVoicemail } from "react-icons/fa";

export const ResumeHeader: React.FC<{ contact: any; current_role: any; experience: any }> = ({ contact, current_role, experience }) => {
  return (
    <section className='bg-white p-6 shadow rounded-xl'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-extrabold'>{contact.name}</h1>
          {current_role?.title?.trim() || current_role?.company?.trim() ? (
            <p className='mt-1 text-sm'>
              {current_role.title?.trim()}
              {current_role.company?.trim() ? ` at ${current_role.company.trim()}` : ""}
            </p>
          ) : null}

          <div className='flex flex-col md:flex-row md:items-center gap-4 mt-4'>
            <div className='flex items-center gap-2'>
              <FaVoicemail className='h-4 w-4' />
              {contact.email}
            </div>
            <div className='flex items-center gap-2'>
              <FaPhone className='h-4 w-4' />
              {contact.phone || "N/A"}
            </div>
            <div className='flex items-center gap-2'>
              <FaClock className='h-4 w-4' />
              Exp: {experience.total_experience}
            </div>
            <div className='flex items-center gap-2'>
              <FaMap className='h-4 w-4' />
              {contact.country}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
