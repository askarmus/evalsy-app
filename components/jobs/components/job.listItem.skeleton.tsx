'use client';
import { Card, CardBody, Skeleton } from '@heroui/react';
import { Plus } from 'lucide-react';

const JobListItemSkeleton = () => {
  // You have 4 cards per row (Add + 3 jobs)
  const skeletonCount = 3;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
      {/* Add New Interview placeholder (static) */}
      <Card shadow="none" className="border-2 border-dashed border-purple-300 flex flex-col items-center justify-center text-center rounded-xl p-6">
        <div className="rounded-full bg-purple-100 p-4 mb-3">
          <Plus className="w-6 h-6 text-purple-600" />
        </div>
        <h3 className="text-base font-semibold mb-1">Add New Interview</h3>
        <p className="text-sm text-gray-500">Create a new interview to start recruiting</p>
      </Card>

      {/* Loading skeleton cards */}
      {Array.from({ length: skeletonCount }).map((_, idx) => (
        <Card key={idx} shadow="sm" radius="md" className="p-4">
          <CardBody className="flex flex-col justify-between gap-4">
            <div>
              <Skeleton className="h-5 w-3/4 rounded-md" />
              <div className="flex items-center gap-3 mt-2">
                <Skeleton className="h-4 w-1/4 rounded-md" />
                <Skeleton className="h-4 w-1/3 rounded-md" />
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>

            <div className="flex justify-between items-center mt-4">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default JobListItemSkeleton;
