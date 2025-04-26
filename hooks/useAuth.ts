"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiClient, { refreshAccessToken } from "@/helpers/apiClient";

export const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await apiClient.get("/auth/me");
        setUser(data);
        setAuthenticated(true); // ✅ authenticated
      } catch {
        const didRefresh = await refreshAccessToken();
        if (didRefresh) {
          try {
            const { data } = await apiClient.get("/auth/me");
            setUser(data);
            setAuthenticated(true); // ✅ authenticated after refresh
          } catch {
            setAuthenticated(false);
            router.replace("/login");
          }
        } else {
          setAuthenticated(false);
          router.replace("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [router]);

  return { user, loading, authenticated };
};
