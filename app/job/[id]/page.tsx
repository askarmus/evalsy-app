// app/job/[id]/page.tsx
import type { Metadata, ResolvingMetadata } from 'next';
import { getJobById } from '@/services/jobApplication.service';
import JobPostingClient from './components/JobPostingClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }, _parent: ResolvingMetadata): Promise<Metadata> {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) return { title: 'Job Not Found' };

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

export default async function JobPostingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const jobData = await getJobById(id);
  if (!jobData) {
    return <div className="text-center py-16 text-gray-600 dark:text-gray-300">Job not found.</div>;
  }

  return <JobPostingClient jobData={jobData} />;
}
