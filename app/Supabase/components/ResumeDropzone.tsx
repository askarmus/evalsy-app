"use client";

import React, { useCallback } from "react";
import { Button, Card, CardBody, Divider, Progress } from "@heroui/react";
import { UploadIcon, Trash2 } from "lucide-react";
import { useUploadResumes } from "../hooks/useUploadResumes";
 
export default function ResumeDropzone() {
  const { queue, addFiles, uploadAll, removeItem } = useUploadResumes();

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }, [addFiles]);

  return (
    <Card shadow="sm" className="rounded-2xl">
      <CardBody className="space-y-4">
        {/* Dropzone */}
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed rounded-2xl p-8 text-center hover:bg-muted/40 transition"
        >
          <p className="text-lg font-semibold">Drag & drop resumes here</p>
          <p className="text-sm opacity-70">or</p>

          <label className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border cursor-pointer mt-2">
            <UploadIcon className="h-4 w-4" />
            <span>Select files</span>
            <input
              type="file"
              className="sr-only"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => e.target.files && addFiles(e.target.files)}
            />
          </label>
        </div>

        {queue.length > 0 && (
          <>
            <Divider />
            <div className="rounded-xl border divide-y">
              {queue.map((q) => (
                <div key={q.tempId} className="p-4 flex items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{q.file.name}</div>
                    <div className="text-xs opacity-70">
                      {(q.file.size / 1024 / 1024).toFixed(2)} MB
                    </div>

                    <div className="mt-2">
                      <Progress
                        size="sm"
                        value={q.progress}
                        aria-label="Upload progress"
                        className="max-w-xl"
                        // visually shows progress; when <100 you can leave it moving via CSS pulse if desired
                      />
                      <div className="text-xs mt-1">
                        {q.status.toUpperCase()} {q.error ? `· ${q.error}` : ""}
                      </div>
                    </div>
                  </div>

                  <Button
                    isIconOnly
                    variant="flat"
                    onPress={() => removeItem(q.tempId)}
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3">
              <Button color="primary" onPress={uploadAll}>
                Upload & Queue Processing
              </Button>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
}
