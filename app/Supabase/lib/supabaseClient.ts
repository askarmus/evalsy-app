"use client";

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://sxntlmqapsdqguchwbts.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4bnRsbXFhcHNkcWd1Y2h3YnRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MTgzODQsImV4cCI6MjA3NDA5NDM4NH0.3S7SpFr_8_Uu_4moYrFkKoL7UHjo6An1SICyHYeQLTg",
  {
    auth: { persistSession: true, autoRefreshToken: true },
    db: { schema: "public" },
  }
);
