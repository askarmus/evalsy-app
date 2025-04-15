"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/helpers/ga";

const TRACKED_ROUTES = ["/analytics", "/landing", "/dashboard"];

export function TrackingWrapper() {
  const pathname = usePathname();

  useEffect(() => {
    if (TRACKED_ROUTES.includes(pathname)) {
      trackPageView(pathname);
    }
  }, [pathname]);

  return null;
}
