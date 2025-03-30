"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getUser } from "@/services/authService";
import { Logo } from "@/components/logo";

// Define route patterns that are publicly accessible
const publicRoutePatterns = [
  /^\/$/, // Home
  /^\/login$/,
  /^\/signup$/,
  /^\/forgot-password$/,
  /^\/reset-password$/,
  /^\/interview\/start(\/.*)?$/, // Matches /interview/start and all its subpaths
];

// Helper to check if a path matches any public route pattern
const isPublicRoute = (path: string) => {
  return publicRoutePatterns.some((pattern) => pattern.test(path));
};

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [canRenderChildren, setCanRenderChildren] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user, error } = await getUser();

        if (error || !user) {
          // 🛑 Unauthenticated
          if (pathname && !isPublicRoute(pathname)) {
            router.push("/login");
          } else {
            setCanRenderChildren(true);
          }
        } else {
          // ✅ Authenticated
          if (pathname && isPublicRoute(pathname)) {
            router.push("/dashboard");
          } else {
            setCanRenderChildren(true);
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        if (pathname && !isPublicRoute(pathname)) {
          router.push("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

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
