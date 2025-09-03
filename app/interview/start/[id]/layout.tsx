import { Providers } from '@/app/providers';

export default function NoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[url('/x.jpg')] bg-cover bg-center">
      <Providers>{children}</Providers>
    </div>
  );
}
