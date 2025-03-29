import { AuthGuard } from "@/components/auth-guard";
import { AuthLayoutWrapper } from "@/components/auth/authLayout";
import "@/styles/globals.css";
import { Suspense } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <AuthLayoutWrapper>
        <AuthGuard>{children} </AuthGuard>
      </AuthLayoutWrapper>
    </Suspense>
  );
}
