'use client';

import { getJobById } from '@/services/jobApplication.service';
import { Card, CardBody, CardHeader, Chip } from '@heroui/react';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaBuilding } from 'react-icons/fa';
import JobApplicationForm from './components/JobApplicationForm';
import JobPostingSkeleton from './components/JobPostingSkeleton';

export default function JobPosting() {
  const [jobData, setJobData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const jobId = params?.id as string;

  const fetchJob = async () => {
    try {
      const data = await getJobById(jobId);
      setJobData(data);
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  if (loading) return <JobPostingSkeleton />;
  if (!jobData) return <div className="text-center">Job not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="grid gap-8">
          {/* Job Header */}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <img src={jobData.user.company.logo} alt={jobData.user.company.name} className="h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{jobData.jobTitle}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <FaBuilding className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600 font-medium">{jobData.user.company.name}</span>
                </div>
              </div>
            </div>
            <Chip variant="bordered" className="bg-slate-100 text-sm">
              {jobData.experienceLevel}
            </Chip>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Job Details */}
            <div className="md:col-span-2 space-y-8">
              <Card className="p-4" shadow="sm" radius="sm">
                <CardHeader>
                  <h2 className="text-lg font-semibold">Job Description</h2>
                </CardHeader>
                <CardBody className="space-y-4 text-slate-600">
                  <div className={`container space-y-4  text-sm job-description  '}`} dangerouslySetInnerHTML={{ __html: jobData?.description || '' }} />
                </CardBody>
              </Card>
            </div>

            {/* Application Form */}
            <JobApplicationForm jobId={jobId} />
          </div>
        </div>
      </div>
    </div>
  );
}
