import { useCredits } from '@/context/CreditContext';
import { Button, Spinner } from '@heroui/react';

type CreditBalanceCardStickyProps = {
  onTopUpClick: () => void;
};

export const CreditBalanceCardSticky = ({ onTopUpClick }: CreditBalanceCardStickyProps) => {
  const { credits, loading } = useCredits();

  return (
    <div className=" p-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-sm font-bold text-xs dark:text-black">{loading ? <Spinner size="sm" /> : credits} Credits Available</div>
          <Button size="sm" className="bg-white dark:text-black " onPress={onTopUpClick}>
            Top Up
          </Button>
        </div>
      </div>
    </div>
  );
};
