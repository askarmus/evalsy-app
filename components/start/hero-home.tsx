import Image from 'next/image';

import PageIllustration from './page-illustration';
import VideoModal from '@/app/interview/start/[id]/components/how-it-work-video';

export default function HeroHome() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className=" pt-48">
          {/* Section header */}
          <div className="pb-12 text-center md:pb-16">
            <h1 className="mb-2 text-5xl font-bold [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-300/.8),transparent)1] md:text-7xl" data-aos="zoom-y-out" data-aos-delay={150}>
              AI-Powered Recruiter.
            </h1>
            <h1 className="text-4xl lg:text-4xl font-black mb-6 leading-tight font-bold" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              <span
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-5"
                style={{
                  backgroundSize: '200% 200%',
                  backgroundPosition: '73.96% 50%',
                  willChange: 'auto',
                }}
              >
                90% Faster. 70% Cheaper.
              </span>
            </h1>
            <div className="mx-auto max-w-3xl">
              <p className="mb-8 text-lg text-gray-700" data-aos="zoom-y-out" data-aos-delay={300}>
                Evalsy automatically interviews candidates 24/7 and gives you AI-powered shortlists. Focus only on the best.
              </p>
            </div>
            <div className="mx-auto max-w-3xl">
              <VideoModal />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
