'use client';

import { useDisclosure } from '@heroui/react';
import { CreditBalanceCardSticky } from '@/components/settings/components/credits/credits/CreditBalanceCardSticky';
import { TopUpCreditsModal } from '@/components/settings/components/credits/credits/TopUpCreditsModal';

export const CreditManager = () => {
  const modal = useDisclosure();

  return (
    <>
      <CreditBalanceCardSticky onTopUpClick={modal.onOpen} />
      <TopUpCreditsModal modal={modal} />
    </>
  );
};
