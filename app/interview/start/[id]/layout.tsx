import { Providers } from '@/app/providers';

export default function NoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="home_v2 min-h-screen">
      <Providers>{children}</Providers>
    </div>
  );
}
