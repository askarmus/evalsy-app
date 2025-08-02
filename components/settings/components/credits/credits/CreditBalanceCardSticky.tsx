import { useCredits } from '@/context/CreditContext';
import { Button, Chip, Spinner } from '@heroui/react';
import { AiFillDollarCircle } from 'react-icons/ai';

type CreditBalanceCardStickyProps = {
  onTopUpClick: () => void;
};

export const CreditBalanceCardSticky = ({ onTopUpClick }: CreditBalanceCardStickyProps) => {
  const { credits, loading } = useCredits();

  return (
    <div className=" p-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button isLoading={loading} size="sm" radius="full" color="secondary" variant="bordered" className="text-secondary-200" onPress={onTopUpClick}>
            Buy Credits ({credits})
          </Button>
        </div>
      </div>
    </div>
  );
};
