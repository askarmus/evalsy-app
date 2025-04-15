"use client";

import { Layout } from "@/components/layout/layout";
import { AuthProvider } from "@/context/AuthContext";
import { ResumeStatusProvider } from "@/context/ResumeStatusContext";
import "@/styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <ResumeStatusProvider>{children}</ResumeStatusProvider>
    </Layout>
  );
}
