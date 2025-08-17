// components/JobOverviewSkeleton.tsx
'use client';

import { Card, CardHeader, CardBody, Divider, Skeleton } from '@heroui/react';

export default function JobOverviewSkeleton() {
  return (
    <Card shadow="sm" className="mt-3">
      <CardHeader className="flex-col items-start gap-1 w-full">
        {/* Job title */}
        <Skeleton className="h-4 w-40 rounded-lg" />
        {/* Chips row */}
        <div className="flex items-center gap-3 p-3">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-40 rounded-full" />
        </div>
      </CardHeader>

      <Divider />

      <CardBody>
        {/* Horizontal stat cards (Location, Verbal Qs, Duration, etc.) */}
        <div className="grid grid-flow-col auto-cols-[minmax(140px,1fr)] gap-4 w-full overflow-x-auto snap-x snap-mandatory">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-card rounded-lg border snap-start min-w-[180px]">
              <Skeleton className="h-5 w-5 rounded-full" />
              <div className="w-full space-y-1">
                <Skeleton className="h-3 w-24 rounded" />
                <Skeleton className="h-4 w-28 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Job Description */}
        <div className="mt-4">
          <div className="mb-2 text-sm font-medium">Job Description</div>
          <Card className="border border-dashed border-default-200 bg-content1" radius="lg" shadow="none">
            <CardBody className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className={`h-3 rounded ${i % 3 === 0 ? 'w-[92%]' : i % 3 === 1 ? 'w-[80%]' : 'w-[64%]'}`} />
              ))}
            </CardBody>
          </Card>
        </div>
      </CardBody>
    </Card>
  );
}
