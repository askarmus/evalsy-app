// app/job/[id]/page.tsx
import type { Metadata, ResolvingMetadata } from 'next';
import { getJobById } from '@/services/jobApplication.service';
import JobPostingClient from './components/JobPostingClient';

const SITE_URL = 'https://www.evalsy.com';

type RouteParams = { id: string };

export async function generateMetadata({ params }: { params: Promise<RouteParams> }, _parent: ResolvingMetadata): Promise<Metadata> {
  const { id } = await params;
  const job = await getJobById(id);
  if (!job) return { title: 'Job Not Found' };

  const title = `${job.jobTitle} at ${job.user.company.name}`;
  const desc = `${job.jobTitle} opening at ${job.user.company.name}. Join our team to lead multi-channel growth, optimize funnels, and scale acquisition for Evalsy. ` + `${job.location || 'Remote'} • Apply now.`;

  const ogImage = job.ogImageUrl || `${SITE_URL}/meta/now_hiring.png`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description: desc, // >= 100 chars to avoid compact card
    alternates: { canonical: `/job/${id}` },
    openGraph: {
      type: 'website',
      siteName: 'Evalsy',
      url: `${SITE_URL}/job/${id}`,
      title,
      description: desc,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 627, // match actual image
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [ogImage],
    },
  };
}

export default async function JobPostingPage({ params }: { params: Promise<RouteParams> }) {
  const { id } = await params;
  const jobData = await getJobById(id);
  if (!jobData) {
    return <div className="text-center py-16 text-gray-600 dark:text-gray-300">Job not found.</div>;
  }
  return <JobPostingClient jobData={jobData} />;
}
