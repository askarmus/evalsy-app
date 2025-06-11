import { getJobById } from '@/services/jobApplication.service';
import { FaBuilding } from 'react-icons/fa';
import { Chip, Card, CardBody, CardHeader, CardFooter } from '@heroui/react';
import JobApplicationForm from './components/JobApplicationForm';
import PoweredBy from '@/app/interview/start/[id]/components/PoweredBy';

export async function generateMetadata({ params }: { params: any }) {
  const { id } = params;

  const job = await getJobById(id);

  if (!job) {
    return {
      title: 'Job Not Found',
    };
  }

  return {
    title: job.jobTitle,
    description: `Job opening at ${job.user.company.name}`,
    openGraph: {
      title: job.jobTitle,
      description: `Job opening at ${job.user.company.name}`,
      images: [
        {
          url: job.ogImageUrl || 'https://www.evalsy.com/meta/now_hiring.png',
          width: 1200,
          height: 630,
          alt: job.jobTitle,
        },
      ],
    },
  };
}

export default async function JobPostingPage({ params }: { params: any }) {
  const { id } = await params;

  const jobData = await getJobById(id);

  if (!jobData) return <div className="text-center">Job not found.</div>;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="grid gap-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <img src={jobData.user.company.logo} alt={jobData.user.company.name} className="h-6" />
              <div>
                <h1 className="text-2xl font-bold">{jobData.jobTitle}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <FaBuilding />
                  <span className="font-medium">{jobData.user.company.name}</span>
                </div>
              </div>
            </div>
            <Chip size="sm" color="primary" variant="bordered">
              {jobData.experienceLevel.toUpperCase()}
            </Chip>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <Card className="p-4" shadow="sm" radius="sm">
                <CardHeader>
                  <h2 className="text-lg font-semibold">Job Description</h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="container space-y-4 text-sm job-description" dangerouslySetInnerHTML={{ __html: jobData.description || '' }} />
                </CardBody>
                <CardFooter />
              </Card>
              <PoweredBy />
            </div>
            <JobApplicationForm jobId={id} userId={jobData.userId} />
          </div>
        </div>
      </div>
    </div>
  );
}
