"use client";

import React from "react";
import { Card, CardBody, Chip, Divider } from "@heroui/react";
import { useResumeStatus } from "../hooks/useResumeStatus";
 
function StatusChip({ status }: { status: string }) {
  const tone =
    status === "completed"
      ? "success"
      : status === "failed"
      ? "danger"
      : status === "queued"
      ? "primary"
      : status === "processing"
      ? "warning"
      : "default";

  return (
    <Chip color={tone as any} variant="flat" size="sm" className="capitalize">
      {status}
    </Chip>
  );
}

export default function ResumeList() {
  const { rows, loading } = useResumeStatus();

  return (
    <Card shadow="sm" className="rounded-2xl">
      <CardBody className="p-0">
        <div className="px-4 py-3 border-b bg-muted/30 font-medium">Recent uploads</div>
        {loading ? (
          <div className="p-4">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-4">No resumes yet.</div>
        ) : (
          <ul className="divide-y">
            {rows.map((r) => (
              <li key={r.id} className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="truncate font-medium">{r.file_name}</div>
                  <div className="text-xs opacity-70 truncate">{r.file_path}</div>
                </div>
                <StatusChip status={r.status} />
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
