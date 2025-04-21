"use client";

import { PricingSubscription } from "@/components/start/PricingSubscription";
import { Button, Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import React from "react";

interface SubscriptionCardProps {
  subscription?: boolean;
  loadingSubscribe: boolean;
  handleSubscribe: () => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ loadingSubscribe, handleSubscribe }) => {
  return (
    <Card className='p-4' shadow='none' radius='sm'>
      <CardHeader className='flex flex-col items-start'>
        <h2 className='text-lg font-semibold mb-2'>Start for just $20/month – Unlimited Jobs & Flexible Invitations!</h2>
      </CardHeader>

      <CardBody>
        <PricingSubscription />
      </CardBody>
      <CardFooter>
        <Button type='submit' onPress={handleSubscribe} color='primary' isLoading={loadingSubscribe} className='mt-4'>
          {loadingSubscribe ? "Redirecting..." : "Upgrade Now"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionCard;
