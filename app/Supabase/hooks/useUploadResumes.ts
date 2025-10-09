"use client";

import { useCallback, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../lib/supabaseClient";
import { UploadItem } from "../lib/types";

/**
 * Simplified hook:
 * - Upload files to Supabase Storage bucket `resumes`
 * - Track progress/status only in local state
 */
export function useUploadResumes() {
  const [queue, setQueue] = useState<UploadItem[]>([]);
  const busy = useRef(false);

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files);
    setQueue((prev) => [
      ...prev,
      ...arr.map((file) => ({
        tempId: uuidv4(),
        file,
        progress: 0,
        status: "uploading" as const,
      })),
    ]);
  }, []);

  const uploadAll = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;

    try {
      for (const item of queue) {
        if (item.status !== "uploading") continue;

        const safeName = item.file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const objectPath = `resumes/${uuidv4()}-${safeName}`;

        // Show “in progress” locally
        setQueue((prev) =>
          prev.map((q) =>
            q.tempId === item.tempId ? { ...q, progress: 25 } : q
          )
        );

        const { error } = await supabase.storage
          .from("resumes")
          .upload(objectPath, item.file, { upsert: false });

        if (error) {
          setQueue((prev) =>
            prev.map((q) =>
              q.tempId === item.tempId
                ? { ...q, status: "failed", error: error.message, progress: 100 }
                : q
            )
          );
        } else {
          setQueue((prev) =>
            prev.map((q) =>
              q.tempId === item.tempId
                ? { ...q, status: "completed", progress: 100 }
                : q
            )
          );
        }
      }
    } finally {
      busy.current = false;
    }
  }, [queue]);

  const removeItem = useCallback((tempId: string) => {
    setQueue((prev) => prev.filter((x) => x.tempId !== tempId));
  }, []);

  return { queue, setQueue, addFiles, uploadAll, removeItem };
}
