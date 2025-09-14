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
  // 👉 make this 120–160 chars
  const desc = `${job.jobTitle} opening at ${job.user.company.name}. Join our fast-growing team to lead growth initiatives across channels, optimize funnels, and scale user acquisition. ${job.location || 'Remote'} • Apply now.`;

  const ogImage = job.ogImageUrl || `${SITE_URL}/meta/now_hiring.png`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description: desc,
    alternates: { canonical: `/job/${id}` },
    openGraph: {
      type: 'website', // 'article' also OK; 'website' is safe
      siteName: 'Evalsy',
      url: `${SITE_URL}/job/${id}`,
      title,
      description: desc,
      images: [
        {
          url: ogImage,
          secureUrl: ogImage,
          width: 1200,
          height: 627, // ✅ matches your actual image
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

export default async function JobPostingPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const jobData = await getJobById(id);
  if (!jobData) return <div className="text-center py-16">Job not found.</div>;
  return <JobPostingClient jobData={jobData} />;
}
