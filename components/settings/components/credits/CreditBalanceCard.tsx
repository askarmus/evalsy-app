'use client';

import { CreditPackageList } from '@/components/shared/CreditPackageCard';
import { useCredits } from '@/context/CreditContext';
import { Card, CardBody, Spinner } from '@heroui/react';

const handleBuy = async (credits: number) => {
  try {
    const { createCheckoutSession } = await import('@/services/credits.service');
    const url = await createCheckoutSession(credits);
    window.location.href = url;
  } catch (error) {
    console.error('Checkout failed:', error);
  }
};

export const CreditBalanceCard = () => {
  const { credits, loading } = useCredits();

  return (
    <Card className="p-0" radius="md" shadow="none">
      <CardBody>
        <h2 className="text-xl font-semibold mb-2">Your Credit Balance</h2>
        <div className="text-3xl font-bold mb-6">{loading ? <Spinner size="sm" /> : credits} credits</div>

        <h2 className="text-lg font-semibold mb-2">Top Up Credits</h2>
        <CreditPackageList onBuy={handleBuy} />
      </CardBody>
    </Card>
  );
};
