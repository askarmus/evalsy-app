"use client";

import React from "react";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";

interface Subscription {
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

interface Props {
  subscription: Subscription | null;
}

const SubscriptionDetailsCard: React.FC<Props> = ({ subscription }) => {
  return (
    <Card shadow='sm' radius='sm' className='p-4'>
      <CardHeader className='flex flex-col items-start'>
        <h2 className='text-lg font-semibold mb-2'>Subscription Status</h2>
        <p className='text-sm text-default-500'>Active period</p>
      </CardHeader>
      <Divider />

      <CardBody className='text-sm'>
        {subscription ? (
          <>
            <p>
              <strong>Subscription Status:</strong> <span className='text-blue-600'>{subscription.status === "active" ? "Active" : subscription.status || "N/A"}</span>
            </p>
            <p>
              <strong>Next Billing Date:</strong> <span className='text-blue-600'>{subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : "N/A"}</span>
            </p>
            <p>
              <strong>Auto-Renewal:</strong> <span className='text-blue-600'>{subscription.cancelAtPeriodEnd ? "Will cancel after this period" : "Auto-renew is enabled"}</span>
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
