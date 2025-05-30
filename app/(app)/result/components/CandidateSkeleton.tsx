// components/CandidateSkeleton.tsx
'use client';

import { Card, CardBody, Spinner } from '@heroui/react';

export default function CandidateSkeleton() {
  return (
    <div className="flex items-center justify-center w-full" style={{ height: 'calc(100vh - 74px)' }}>
      <Card shadow="sm" className="overflow-hidden col-span-full">
        <CardBody className="p-0">
          <div className="flex flex-col md:flex-row items-center justify-between p-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-muted/30 p-3 rounded-full">
                <Spinner />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-medium">Loading Interview Results</h3>
                <p className="text-sm text-muted-foreground">Please wait while we load the candidate’s interview results and analysis.</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
