'use client';

import { getJobById } from '@/services/jobApplication.service';
import { Upload } from '@google-cloud/storage/build/cjs/src/resumable-upload';
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, cn, Input, Textarea } from '@heroui/react';
import { Server } from 'http';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaBriefcase, FaBuilding, FaClock, FaUpload } from 'react-icons/fa';
import JobApplicationForm from './components/JobApplicationForm';

export default function JobPosting() {
  const [file, setFile] = useState<File | null>(null);
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

  if (loading) return <div className="text-center">Loading...</div>;
  if (!jobData) return <div className="text-center">Job not found.</div>;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="grid gap-8">
          {/* Job Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">IT-Operations Manager</h1>
              <div className="flex items-center gap-2 mt-2 text-slate-600">
                <FaBuilding className="h-4 w-4 text-slate-500" />
                Evalsy (Pvt) Ltd
              </div>
            </div>
            <Chip variant="bordered" className="bg-slate-100 text-sm">
              Beginner
            </Chip>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Job Details */}
            <div className="md:col-span-2 space-y-8">
              <Card className="p-2" shadow="none">
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

// 'use client';
// import React, { useEffect, useState } from 'react';
// import JobApplicationForm from './components/JobApplicationForm';

// import { useParams, useSearchParams } from 'next/navigation';
// import { getJobById } from '@/services/jobApplication.service';

// const InterviewInstruction: React.FC = () => {
//   const [jobData, setJobData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const params = useParams();
//   const jobId = params?.id as string;

//   const fetchJob = async () => {
//     try {
//       const data = await getJobById(jobId);
//       setJobData(data);
//     } catch (error) {
//       console.error('Error fetching job:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchJob();
//   }, [jobId]);

//   if (loading) return <div className="text-center">Loading...</div>;
//   if (!jobData) return <div className="text-center">Job not found.</div>;

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center">
//       <main className="w-full max-w-screen-lg mx-auto px-6 py-8 space-y-6">
//         <div className="space-y-4 border-b pb-6">
//           <h1 className="text-3xl font-bold">{jobData.jobTitle}</h1>
//           <img src={jobData.user.company.logo} alt={jobData.user.company.name} className="h-16" />

//           <p>
//             <strong>Experience Level:</strong> {jobData.experienceLevel}
//           </p>
//         </div>

//         <div className="mt-1 flex flex-col gap-[6px] font-xs">
//           <h1 className="text-md font-medium text-tertiary mb-2">Job Description</h1>

//           <div className="relative">
//             <div className={`text-primary4 container space-y-4 text-sm pr-2  max-h-full  overflow-hidden'}`} dangerouslySetInnerHTML={{ __html: jobData?.description || '' }} />
//           </div>
//         </div>

//         {/* Job Info Section */}

//         {/* Job Application Form */}
//         <JobApplicationForm jobId={jobId} />
//       </main>
//     </div>
//   );
// };

// export default InterviewInstruction;
