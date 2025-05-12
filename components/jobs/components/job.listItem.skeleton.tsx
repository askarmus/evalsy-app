import { Card, CardBody, CardHeader, Skeleton } from '@heroui/react';

const JobListItemSkeleton = () => {
  return (
    <>
      <Card shadow="sm" radius="md" className="p-4 w-full">
        <CardHeader className="flex items-center w-full">
          <div className="w-full">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-full mt-1" />
            <Skeleton className="h-4 w-full mt-1" />
          </div>
        </CardHeader>
      </Card>{' '}
      <Card shadow="sm" radius="md" className="p-4 w-full mt-6">
        <CardHeader className="flex items-center w-full">
          <div className="w-full">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-full mt-1" />
            <Skeleton className="h-4 w-full mt-1" />
          </div>
        </CardHeader>
      </Card>{' '}
      <Card shadow="sm" radius="md" className="p-4 w-full mt-6">
        <CardHeader className="flex items-center w-full">
          <div className="w-full">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-full mt-1" />
            <Skeleton className="h-4 w-full mt-1" />
          </div>
        </CardHeader>
      </Card>
      <Card shadow="sm" radius="md" className="p-4 w-full mt-6">
        <CardHeader className="flex items-center w-full">
          <div className="w-full">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-full mt-1" />
            <Skeleton className="h-4 w-full mt-1" />
          </div>
        </CardHeader>
      </Card>
    </>
  );
};

export default JobListItemSkeleton;
