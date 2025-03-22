"use client";
import { Layout } from "@/components/layout/layout";
import "@/styles/globals.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { getUser } from "@/services/authService";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const { push } = useRouter();

  useEffect(() => {
    (async () => {
      const { user, error } = await getUser();

      if (error) {
        push("/");
        return;
      }
      setIsSuccess(true);
    })();
  }, [push]);

  if (!isSuccess) {
    return (
      <div className='fixed inset-0 flex items-center justify-center bg-white z-50'>
        <div className='flex flex-col items-center'>
          <Logo />
          <div className='text-sm mt-2'>Loading...</div>
        </div>
      </div>
    );
  }

  return <Layout>{children}</Layout>;
}
