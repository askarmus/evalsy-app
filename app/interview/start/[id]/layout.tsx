export default function NoLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-[url('/02.svg')] bg-cover bg-center">{children}</div>;
}
