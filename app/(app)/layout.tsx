"use client";

import { AuthGuard } from "@/components/auth-guard";
import { Layout } from "@/components/layout/layout";
import { ResumeStatusProvider } from "@/context/ResumeStatusContext";
import "@/styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <Layout>
        <ResumeStatusProvider> {children} </ResumeStatusProvider>
      </Layout>
    </AuthGuard>
  );
}
