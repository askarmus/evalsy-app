// app/job/[id]/page.tsx
import type { Metadata, ResolvingMetadata } from 'next';
import { getJobById } from '@/services/jobApplication.service';
import JobPostingClient from './components/JobPostingClient';

const SITE_URL = 'https://www.evalsy.com';

export async function generateMetadata({ params }: { params: { id: string } }, _parent: ResolvingMetadata): Promise<Metadata> {
  const { id } = params;
  const job = await getJobById(id);

  if (!job) return { title: 'Job Not Found' };

  const title = `${job.jobTitle} at ${job.user.company.name}`;
  const desc = `${job.jobTitle} opening at ${job.user.company.name}` + (job.location ? ` – ${job.location}` : '');
  const ogImage = job.ogImageUrl || `${SITE_URL}/meta/now_hiring.png`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description: desc,
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
          // ✅ match the real image size
          width: 1200,
          height: 627,
          alt: `${job.jobTitle} – ${job.user.company.name}`,
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

export default async function JobPostingPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const jobData = await getJobById(id);
  if (!jobData) {
    return <div className="text-center py-16 text-gray-600 dark:text-gray-300">Job not found.</div>;
  }
  return <JobPostingClient jobData={jobData} />;
}
