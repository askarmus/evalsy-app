import { AuthLayoutWrapper } from "@/components/auth/authLayout";
import "@/styles/globals.css";
import { Suspense } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <AuthLayoutWrapper>{children}</AuthLayoutWrapper>{" "}
    </Suspense>
  );
}
