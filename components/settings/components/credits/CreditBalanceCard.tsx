'use client';

import { CreditPackageList } from '@/components/shared/CreditPackageCard';
import { useCredits } from '@/context/CreditContext';
import { Card, CardBody, Spinner } from '@heroui/react';
import { Subscript, Wallet } from 'lucide-react';

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
    <Card className="p-0" radius="md">
      <CardBody>
        <div className="mb-6 flex items-center gap-[5px] mb-3 md:mb-4 ">
          <Wallet className="w-5 h-5 text-xl text-secondary-400" />
          <h1 className=" text-xl/[24px] font-semibold text-tertiary  md:text-[20px]/[24px]">Credit Balance</h1>
        </div>

        <div className="text-center py-4">
          <div className="text-2xl font-bold text-slate-800 mb-1">{loading ? <Spinner size="sm" /> : credits} credits</div>
          <p className="text-sm text-slate-500">Current balance</p>
        </div>
        <h2 className="text-lg font-semibold mb-2">Top Up Credits</h2>
        <CreditPackageList onBuy={handleBuy} />
      </CardBody>
    </Card>
  );
};
