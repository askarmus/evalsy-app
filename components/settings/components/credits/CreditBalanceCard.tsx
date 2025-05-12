'use client';

import { useCredits } from '@/context/CreditContext';
import { Card, CardBody } from '@heroui/react';

export const CreditBalanceCard = () => {
  const { credits } = useCredits();

  return (
    <Card className="p-5" radius="md" shadow="md">
      <CardBody>
        <h1 className="text-xl font-semibold mb-4">Credit Transaction</h1>
        <h2 className="text-xl font-semibold mb-2">Your Credit Balance</h2>
        <p className="text-3xl font-bold">{credits} credits</p>
      </CardBody>
    </Card>
  );
};
