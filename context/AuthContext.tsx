"use client";

import { createContext, useEffect, useState } from "react";
import { getCurrentUser } from "@/services/authService";
import type { User } from "@/types/user";
import { useRouter } from "next/navigation";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch((err) => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return <AuthContext.Provider value={{ user, loading, setUser }}>{children}</AuthContext.Provider>;
};
