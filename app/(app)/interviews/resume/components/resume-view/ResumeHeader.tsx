import React from 'react';
import { FaClock, FaMap, FaPhone, FaVoicemail } from 'react-icons/fa';

export const ResumeHeader: React.FC<{ contact: any; current_role: any; experience: any }> = ({ contact, current_role, experience }) => {
  return (
    <section className=" ">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h1 className="text-2xl font-semibold">{contact?.candidatename}</h1>
          {current_role?.title?.trim() || current_role?.current_company?.trim() ? (
            <p className="mt-1 text-md">
              {current_role.title?.trim()}
              {current_role.company?.trim() ? ` at ${current_role.current_company.trim()}` : ''}
            </p>
          ) : null}

          <div className="flex flex-col md:flex-row md:items-center gap-4 mt-1 text-md">
            <div className="flex items-center gap-2">{contact.email}</div>
            <div className="flex items-center gap-2">| {contact.mobile || 'N/A'}</div>
            <div className="flex items-center gap-2">| Exp: {experience.total_experience}</div>
            <div className="flex items-center gap-2">| {contact.current_country}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
