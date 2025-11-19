import ResumeUploaderHero from '@/app/(app)/interviews/resume/components/ResumeUploaderHero';

export default function Page({ params }: { params: { id: string } }) {
  return <ResumeUploaderHero jobId={params.id} />;
}
