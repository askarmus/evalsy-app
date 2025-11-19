'use client';

import ResumeUploaderHero from '@/app/(app)/interviews/resume/components/ResumeUploaderHero';

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="p-4">
      <ResumeUploaderHero jobId={params.id} />
    </div>
  );
}
