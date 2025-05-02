"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import apiClient, { refreshAccessToken } from "@/helpers/apiClient";

export const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await apiClient.get("/auth/me");
        setUser(data);
        setAuthenticated(true);
      } catch {
        const didRefresh = await refreshAccessToken();
        if (didRefresh) {
          try {
            const { data } = await apiClient.get("/auth/me");
            setUser(data);
            setAuthenticated(true);
          } catch {
            setAuthenticated(false);
            if (pathname !== "/") {
              router.replace("/login");
            }
          }
        } else {
          setAuthenticated(false);
          if (pathname !== "/") {
            router.replace("/login");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [router, pathname]);

  return { user, loading, authenticated };
};
