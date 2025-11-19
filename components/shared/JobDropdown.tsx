'use client';
import React, { useEffect, useState } from 'react';
import { Autocomplete, AutocompleteItem } from '@heroui/react';
import { getAllJobs } from '@/services/job.service';

interface JobDropdownProps {
  value: string | null;
  onChange: (jobId: string) => void;
}

export default function JobDropdown({ value, onChange }: JobDropdownProps) {
  const [jobLookup, setJobLookup] = useState<any[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const jobs = await getAllJobs();
      setJobLookup(jobs);

      // ⭐ Auto-select first job if no job selected yet
      if (jobs.length > 0 && !value) {
        onChange(jobs[0].id.toString());
      }
    };

    fetchJobs();
  }, []);

  return (
    <Autocomplete
      label="Select a Job"
      variant="bordered"
      selectedKey={value ?? undefined}
      onSelectionChange={(key) => {
        if (key) onChange(key.toString());
      }}
      className="w-full"
    >
      {jobLookup.map((job) => (
        <AutocompleteItem key={job.id}>{job.jobTitle}</AutocompleteItem>
      ))}
    </Autocomplete>
  );
}
