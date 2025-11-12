// app/job/[id]/JobPostingClient.tsx
'use client';

import { useMemo, useState } from 'react';
import { Button, Input, Card, CardBody, Divider } from '@heroui/react';
import { Shield, Linkedin, Twitter, Facebook, ArrowLeft } from 'lucide-react';

import PoweredBy from '@/app/interview/start/[id]/components/PoweredBy';
import JobApplicationForm from './JobApplicationForm';
import { FaBackward } from 'react-icons/fa';
import Link from 'next/link';
import { toTitleCase } from '@/app/utils/text.utls';
import { AnimatePresence, motion } from 'framer-motion';

type JobData = {
  id: string;
  jobTitle: string;
  description?: string;
  country?: string;
  city?: string;
  workplaceType?: string; // e.g., Remote/Hybrid/Onsite
  experienceLevel?: string; // e.g., junior/mid/senior
  userId: string;
  shareUrl?: string;
  publicUrl?: string;
  user: {
    company: {
      name: string;
      logo?: string;
    };
  };
};

export default function JobPostingClient({ jobData }: { jobData: JobData }) {
  const [isApply, setIsApply] = useState(false);

  // Build a shareable link (fallbacks if not provided by API)
  const shareLink = useMemo(() => {
    if (jobData.publicUrl) return jobData.publicUrl;
    if (jobData.shareUrl) return jobData.shareUrl;
    if (typeof window !== 'undefined') return window.location.href;
    return '';
  }, [jobData.publicUrl, jobData.shareUrl]);

  const companyLogo = jobData.user?.company?.logo;
  const companyName = jobData.user?.company?.name;

  const onShareClick = (network: 'linkedin' | 'twitter' | 'facebook') => {
    const url = encodeURIComponent(shareLink);
    const text = encodeURIComponent(`${jobData.jobTitle} at ${companyName}`);
    const shareUrls = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    };
    window.open(shareUrls[network], '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen  m-10">
      <div className="min-h-screen  bg-gray-100 dark:bg-gray-900 rounded-2xl  mb-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {companyLogo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={companyLogo} alt={companyName} className="h-12 w-auto object-contain" />
                ) : (
                  <div className="h-12 w-12 rounded bg-gray-200 dark:bg-gray-700" />
                )}
              </div>
              <div>{jobData.user.company.name}</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardBody className="p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Job content */}
                <div className="lg:col-span-2">
                  {/* Title + Location */}
                  <div className="mb-6">
                    <h1 className="text-3xl font-semibold text-secondary-600 dark:text-secondary-400 mb-2">{jobData.jobTitle}</h1>
                    <p className="text-gray-600 dark:text-gray-300">
                      {jobData.country}
                      {jobData.country && jobData.city ? ', ' : ''}
                      {jobData.city}
                      {jobData.workplaceType ? ` (${toTitleCase(jobData.workplaceType)})` : ''}
                    </p>
                  </div>
                  <Divider className="mb-6" />

                  {/* Application Form + Description (animated switcher) */}
                  <div className="mb-8 space-y-6">
                    <AnimatePresence mode="wait" initial={false} custom={isApply ? 1 : -1}>
                      {isApply ? (
                        <motion.div key="apply-form" custom={1} initial={(d: number) => ({ x: d > 0 ? 48 : -48, opacity: 0 })} animate={{ x: 0, opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } }} exit={(d: number) => ({ x: d > 0 ? -48 : 48, opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } })} className="will-change-transform">
                          <JobApplicationForm jobId={jobData.id} userId={jobData.userId} onCancel={() => setIsApply(false)} />
                        </motion.div>
                      ) : (
                        <motion.div key="job-desc" custom={-1} initial={(d: number) => ({ x: d > 0 ? 48 : -48, opacity: 0 })} animate={{ x: 0, opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } }} exit={(d: number) => ({ x: d > 0 ? -48 : 48, opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } })} className="will-change-transform">
                          <div className="prose max-w-none dark:prose-invert prose-headings:scroll-mt-24 job-description text-sm space-y-4" dangerouslySetInnerHTML={{ __html: jobData.description || '' }} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Right: Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-8 space-y-6">
                    {/* Apply */}
                    <div className="bg-gray-[#f3f4f6] dark:bg-gray-700 p-6 rounded-lg">
                      <Button onPress={() => setIsApply((prev) => !prev)} size="lg" radius="full" color="secondary" variant={!isApply ? 'solid' : 'bordered'} className="w-full font-semibold size-2xl">
                        {isApply && <ArrowLeft />} {!isApply ? 'Apply for This Job' : 'View Job Description'}
                      </Button>
                    </div>

                    {/* Share / Link */}
                    <div className="bg-gray-[#f3f4f6] dark:bg-gray-700 p-6 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-3">Link to This Job</h3>
                      <Input value={shareLink} readOnly className="text-sm mb-4 bg-white dark:bg-gray-600" />
                      <div className="flex space-x-3">
                        <Button isIconOnly size="sm" className="p-2 w-10 h-10 bg-white dark:bg-gray-600" aria-label="Share on LinkedIn" onPress={() => onShareClick('linkedin')}>
                          <Linkedin className="w-4 h-4" />
                        </Button>
                        <Button isIconOnly size="sm" className="p-2 w-10 h-10 bg-white dark:bg-gray-600" aria-label="Share on X/Twitter" onPress={() => onShareClick('twitter')}>
                          <Twitter className="w-4 h-4" />
                        </Button>
                        <Button isIconOnly size="sm" className="p-2 w-10 h-10 bg-white dark:bg-gray-600" aria-label="Share on Facebook" onPress={() => onShareClick('facebook')}>
                          <Facebook className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Facts */}
                    <div className="bg-gray-[#f3f4f6] dark:bg-gray-700 p-6 rounded-lg space-y-4">
                      <div className="">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">Location</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{[jobData.country, jobData.city].filter(Boolean).join(', ') || '—'}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">Workplace Type</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{toTitleCase(jobData.workplaceType)}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">Experience Level</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{toTitleCase(jobData.experienceLevel)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Sidebar */}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {!isApply && (
        <div className="mx-auto flex w-full max-w-[90rem] items-center px-5 xl:px-8 xl2:px-[60px] xl2:!pr-[60px] justify-between">
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm  mr-10">© 2025 Evalsy. All rights reserved.</p>
              <div className="flex space-x-6">
                <Link target="_blank" className="text-sm    transition-colors hover:underline" href="/privacy-policy">
                  • Privacy Policy
                </Link>
                <Link target="_blank" className="text-sm  transition-colors hover:underline" href="/terms">
                  • Terms of Service
                </Link>
              </div>
            </div>
          </div>

          <img src="/final-light.png" alt={'Logo'} className="h-8 w-auto object-contain" />
        </div>
      )}
    </div>
  );
}
