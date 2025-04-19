"use client";

import { Button, Card, CardBody, CardFooter, CardHeader, Divider } from "@heroui/react";
import React from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";

interface SubscriptionCardProps {
  subscription: boolean;
  loadingSubscribe: boolean;
  handleSubscribe: () => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription, loadingSubscribe, handleSubscribe }) => {
  return (
    <Card className='p-4' shadow='sm' radius='sm'>
      <CardHeader className='flex flex-col items-start'>
        <h2 className='text-lg font-semibold mb-2'>Base Plan</h2>
        <p className='text-sm text-default-500'>
          Monthly: <strong> 20$</strong>
        </p>
      </CardHeader>
      <Divider />
      <Divider />
      <CardBody>
        <ul role='list' className='mt-4 flex flex-col gap-y-3 text-sm'>
          <li className='flex'>
            <AiOutlineCheckCircle className='h-6 w-6 flex-none text-green-600' />
            <span className='ml-4'>
              <strong>Unlimited</strong> Job Postings
            </span>
          </li>
          <li className='flex'>
            <AiOutlineCheckCircle className='h-6 w-6 flex-none text-green-600' />
            <span className='ml-4'>
              <strong>50 Free Invitations</strong> per month
            </span>
          </li>
          <li className='flex'>
            <AiOutlineCheckCircle className='h-6 w-6 flex-none text-green-600' />
            <span className='ml-4'>Secure Stripe Billing</span>
          </li>
          <li className='flex'>
            <AiOutlineCheckCircle className='h-6 w-6 flex-none text-green-600' />
            <span className='ml-4'>
              <strong>$0.10 per extra invite</strong> beyond 50
            </span>
          </li>
          <li className='flex'>
            <AiOutlineCheckCircle className='h-6 w-6 flex-none text-green-600' />
            <span className='ml-4'>Auto-billed at the end of the month</span>
          </li>
          <li className='flex'>
            <AiOutlineCheckCircle className='h-6 w-6 flex-none text-green-600' />
            <span className='ml-4'>Cancel Anytime</span>
          </li>
        </ul>
      </CardBody>
      <CardFooter>
        {!subscription && (
          <Button type='submit' onPress={handleSubscribe} color='primary' isLoading={loadingSubscribe} className='mt-4'>
            {loadingSubscribe ? "Redirecting..." : "Subscribe Now"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SubscriptionCard;
