'use client';
import React, { useState } from 'react';

import ResumeUploaderHero from '../interviews/resume/[id]/page';
import JobDropdown from '@/components/shared/JobDropdown';
import { Card, CardBody } from '@heroui/react';

export default function AIShortlist() {
  const [jobId, setJobId] = useState<string | null>(null);

  return (
    <div className="h-full lg:px-6">
      <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap  mx-auto w-full">
        <div className="mt-6 gap-6 flex flex-col w-full">
          <Card className="p-2">
            <CardBody>
              <div className="pr-4 pl-4 w-64">
                <JobDropdown value={jobId} onChange={setJobId} />
              </div>

              {jobId && <ResumeUploaderHero jobId={jobId} />}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
