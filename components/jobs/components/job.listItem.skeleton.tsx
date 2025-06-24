import { Card, CardBody, CardHeader, Skeleton } from '@heroui/react';

const JobListItemSkeleton = () => {
  return (
    <>
      <Card shadow="none" className="P-3 border-2 border-black rounded-xl ">
        <CardHeader className="flex items-center w-full">
          <div className="w-full">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-full mt-1" />
            <Skeleton className="h-4 w-full mt-1" />
          </div>
        </CardHeader>
      </Card>{' '}
      <Card shadow="none" className="P-3 border-2 border-black rounded-xl mt-6">
        <CardHeader className="flex items-center w-full">
          <div className="w-full">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-full mt-1" />
            <Skeleton className="h-4 w-full mt-1" />
          </div>
        </CardHeader>
      </Card>{' '}
      <Card shadow="none" className="P-3 border-2 border-black rounded-xl mt-6">
        <CardHeader className="flex items-center w-full">
          <div className="w-full">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-full mt-1" />
            <Skeleton className="h-4 w-full mt-1" />
          </div>
        </CardHeader>
      </Card>
      <Card shadow="none" className="P-3 border-2 border-black rounded-xl mt-6">
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
