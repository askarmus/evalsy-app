"use client";

import { createContext, useContext } from "react";

interface AuthContextType {
  user: any;
  loading: boolean;
  authenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  authenticated: false,
});

export const useAuthContext = () => useContext(AuthContext);
