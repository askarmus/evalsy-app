import { Providers } from '@/app/providers';

interface Props {
  children: React.ReactNode;
}

export const AuthLayoutWrapper = ({ children }: Props) => {
  return (
    <div className="flex h-screen">
      <div className="flex-1 flex-col flex items-center justify-center p-6">
        <Providers>{children} </Providers>
      </div>
    </div>
  );
};
