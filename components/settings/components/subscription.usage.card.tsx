"use client";
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Skeleton, Divider } from "@heroui/react";
import { getSubscriptionUsage } from "@/services/subscription.service";

export default function SubscriptionUsageCard() {
  const [usage, setUsage] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchUsage() {
    const data = await getSubscriptionUsage();
    console.log("Usage data:", data);
    setUsage(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchUsage();
  }, []);

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString();

  if (loading || !usage) {
    return (
      <div className='flex justify-center items-center h-40'>
        <Skeleton className='h-6 w-3/4 mb-2' />
        <Skeleton className='h-6 w-1/2 mb-2' />
        <Skeleton className='h-6 w-1/4' />
        <Skeleton className='h-6 w-1/2 mb-2' />
        <Skeleton className='h-6 w-1/4' />
      </div>
    );
  }

  return (
    <Card shadow='sm' className='p-4'>
      <CardHeader className='flex flex-col items-start'>
        <h2 className='text-lg font-semibold mb-2'>Usage Summary</h2>
        <p className='text-sm text-default-500'>
          Billing Period: <strong>{formatDate(usage.billingPeriodStart)}</strong> - <strong>{formatDate(usage.billingPeriodEnd)}</strong>
        </p>
      </CardHeader>
      <Divider />
      <CardBody className='grid grid-cols-2 gap-4 text-sm'>
        <div>
          <h4 className='font-semibold mb-2'>Invitations</h4>
          <p>Total Used: {usage.totalInvites}</p>
          <p>
            Extra Used: <strong color='warning'>{usage.extraInvites}</strong>
          </p>
          <p>Charge: ${usage.estimatedTotalInvitation.toFixed(2)}</p>
        </div>
        <div>
          <h4 className='font-semibold mb-2'>Resumes</h4>
          <p>Total Used: {usage.totalResumes}</p>
          <p>
            Extra Used: <strong color='warning'>{usage.extraResumes}</strong>
          </p>
          <p>Charge: ${usage.estimatedTotalResume.toFixed(2)}</p>
        </div>
        <div className='col-span-2   mt-2'>
          <Divider className='my-2' />
          <p className='font-semibold'>
            Estimated Total (Next Invoice): <span className='text-primary'>${usage.estimatedTotal.toFixed(2)}</span>
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
