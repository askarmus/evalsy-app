"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/services/authService";
import { Logo } from "@/components/logo";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const { push } = useRouter();

  useEffect(() => {
    (async () => {
      const { user, error } = await getUser();

      if (error) {
        push("/");
        return;
      }

      setIsSuccess(true);

      if (typeof window !== "undefined" && window.location.pathname === "/") {
        push("/dashboard");
      }
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

  return <>{children}</>;
}
