'use client';

import { Card, CardBody, CardHeader, Skeleton } from '@heroui/react';
import React from 'react';

export default function JobPostingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="grid gap-8">
          {/* Header Skeleton */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-64 rounded" />
                <Skeleton className="h-4 w-40 rounded" />
                <Skeleton className="h-4 w-40 rounded" />
              </div>
            </div>
            <Skeleton className="h-6 w-24 rounded" />
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Job Description Skeleton */}
            <div className="md:col-span-2 space-y-6">
              <Card className="p-4" shadow="sm" radius="sm">
                <CardHeader>
                  <Skeleton className="h-5 w-40 rounded" />
                </CardHeader>
                <CardBody className="space-y-4">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-5/6 rounded" />
                  <Skeleton className="h-4 w-2/3 rounded" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-4 w-1/2 rounded" />
                  <Skeleton className="h-4 w-1/2 rounded" />
                  <Skeleton className="h-4 w-1/2 rounded" />
                  <Skeleton className="h-4 w-1/2 rounded" />
                  <Skeleton className="h-4 w-1/2 rounded" />
                </CardBody>
              </Card>
            </div>

            {/* Application Form Skeleton */}
            <Card className="p-4" shadow="sm" radius="sm">
              <CardHeader className="flex flex-col gap-2">
                <Skeleton className="h-5 w-40 rounded" />
                <Skeleton className="h-4 w-56 rounded" />
              </CardHeader>
              <CardBody className="space-y-4">
                <Skeleton className="h-10 w-full rounded" />
                <Skeleton className="h-10 w-full rounded" />
                <Skeleton className="h-24 w-full rounded" />
                <Skeleton className="h-10 w-full rounded" />
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
