"use client";

import { AuthGuard } from "@/components/auth-guard";
import { Layout } from "@/components/layout/layout";
import "@/styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <Layout>{children}</Layout>
    </AuthGuard>
  );
}
