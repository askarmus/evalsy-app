"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/services/authService";
import { Logo } from "@/components/logo";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { push } = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { user, error } = await getUser();

      const publicRoutes = ["/login", "/signup", "/forgot-password", "/reset-password"];
      const currentPath = window.location.pathname;

      if (error || !user) {
        if (!publicRoutes.includes(currentPath)) {
          push("/login"); // 🚫 User not logged in, send to login if on protected route
        }
        setIsLoading(false);
        return;
      }

      // ✅ User is logged in
      setIsAuthenticated(true);

      if (publicRoutes.includes(currentPath)) {
        push("/dashboard"); // 🚀 Logged-in users shouldn't stay on login/signup/etc.
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [push]);

  if (isLoading) {
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
