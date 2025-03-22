"use client";

import React from "react";
import { Card, CardBody, CardHeader, Divider, Skeleton } from "@heroui/react";

interface Subscription {
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

interface Props {
  subscription: Subscription | null;
  loadingSubscription: boolean;
}

const SubscriptionDetailsCard: React.FC<Props> = ({ subscription, loadingSubscription }) => {
  return (
    <Card shadow='sm' className='p-4'>
      <CardHeader className='flex flex-col items-start'>
        <h2 className='text-lg font-semibold mb-2'>Subscription Status</h2>
        <p className='text-sm text-default-500'>Active period</p>
      </CardHeader>
      <Divider />

      <CardBody className='text-sm'>
        {loadingSubscription ? (
          <>
            <Skeleton className='h-6 w-3/4 mb-2' />
            <Skeleton className='h-6 w-1/2 mb-2' />
            <Skeleton className='h-6 w-1/4' />
          </>
        ) : subscription ? (
          <>
            <p>
              <strong>Subscription Status:</strong> <span className='text-blue-600'>{subscription.status === "active" ? "Active – Subscription is currently active" : subscription.status || "N/A"}</span>
            </p>
            <p>
              <strong>Renews On:</strong> <span className='text-blue-600'>{subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : "N/A"}</span>
            </p>
            <p>
              <strong>Auto-Renewal:</strong> <span className='text-blue-600'>{subscription.cancelAtPeriodEnd ? "Will cancel at end of current period" : "Set to auto-renew"}</span>
            </p>
          </>
        ) : (
          <p>No active subscription.</p>
        )}
      </CardBody>
    </Card>
  );
};

export default SubscriptionDetailsCard;
