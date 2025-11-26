import { Providers } from '@/app/providers';

export default function NoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dot-bg min-h-screen">
      <Providers>{children}</Providers>
    </div>
  );
}
