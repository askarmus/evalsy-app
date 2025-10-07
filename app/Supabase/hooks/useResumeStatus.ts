"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { ResumeRow } from "../lib/types";
 

/** Live list of resumes with realtime Postgres changes. */
export function useResumeStatus(initialLimit = 50) {
  const [rows, setRows] = useState<ResumeRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(initialLimit);

      if (!ignore && !error && data) setRows(data as ResumeRow[]);
      setLoading(false);
    }

    load();

    const channel = supabase
      .channel("resumes-status")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "resumes" },
        (payload: any) => setRows((prev) => [payload.new as ResumeRow, ...prev])
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "resumes" },
        (payload: any) =>
          setRows((prev) =>
            prev.map((r) => (r.id === payload.new.id ? (payload.new as ResumeRow) : r))
          )
      )
      .subscribe();

  return () => {
      ignore = true;
      supabase.removeChannel(channel);
    };
  }, [initialLimit]);

  return { rows, loading };
}
