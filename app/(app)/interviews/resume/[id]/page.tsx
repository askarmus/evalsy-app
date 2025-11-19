'use client';

import { useParams } from 'next/navigation';
import ResumeUploaderHero from '../components/ResumeUploaderHero';

export default function Page() {
  const { id } = useParams() as { id?: string };

  return <ResumeUploaderHero jobId={id as string} />;
}
