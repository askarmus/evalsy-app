"use client";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";

interface Usage {
  billingPeriodStart: string;
  billingPeriodEnd: string;
  totalInvites: number;
  extraInvites: number;
  estimatedTotalInvitation: number;
  totalResumes: number;
  extraResumes: number;
  estimatedTotalResume: number;
}

export default function SubscriptionUsageCard({ usage }: { usage: Usage }) {
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString();

  return (
    <Card shadow='sm' radius='sm' className='p-4'>
      <CardHeader className='flex flex-col items-start'>
        <h2 className='text-lg font-semibold mb-2'>Usage Summary</h2>
        <p className='text-sm text-default-500'>
          Billing Period: <strong>{formatDate(usage.billingPeriodStart)}</strong> – <strong>{formatDate(usage.billingPeriodEnd)}</strong>
        </p>
      </CardHeader>
      <Divider />
      <CardBody className='grid grid-cols-2 gap-4 text-sm'>
        <div>
          <h4 className='font-semibold mb-2'>Invitation Usage</h4>
          <p>Included in Plan: {usage.totalInvites}</p>
          <p>Additional Invitations Used: {usage.extraInvites}</p>
          <p>Additional Usage Cost: ${usage.estimatedTotalInvitation.toFixed(2)}</p>
        </div>
        <div>
          <h4 className='font-semibold mb-2'>Resume Usage</h4>
          <p>Included in Plan: {usage.totalResumes}</p>
          <p>Additional Resumes Processed: {usage.extraResumes}</p>
          <p>Additional Usage Cost: ${usage.estimatedTotalResume.toFixed(2)}</p>
        </div>
      </CardBody>
    </Card>
  );
}
