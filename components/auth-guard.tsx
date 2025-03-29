"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getUser } from "@/services/authService";
import { Logo } from "@/components/logo";

const publicRoutes = ["/", "/login", "/signup", "/forgot-password", "/reset-password"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [canRenderChildren, setCanRenderChildren] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // This is the correct way to get the path in Next.js

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user, error } = await getUser();

        if (error || !user) {
          // 🛑 Unauthenticated
          if (pathname && !publicRoutes.includes(pathname)) {
            router.push("/login");
          } else {
            setCanRenderChildren(true);
          }
        } else {
          // ✅ Authenticated
          if (pathname && publicRoutes.includes(pathname)) {
            router.push("/dashboard");
          } else {
            setCanRenderChildren(true);
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        if (pathname && !publicRoutes.includes(pathname)) {
          router.push("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]); // Add pathname to dependencies

  if (isLoading || !canRenderChildren) {
    return (
      <div className='fixed inset-0 flex items-center justify-center bg-white z-50'>
        <div className='flex flex-col items-center'>
          <Logo />
          <div className='text-sm mt-2 text-gray-500'>Loading...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
