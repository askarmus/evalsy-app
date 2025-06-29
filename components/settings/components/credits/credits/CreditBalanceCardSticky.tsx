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
          <Chip color="warning" startContent={<AiFillDollarCircle />}>
            {loading ? <Spinner size="sm" /> : credits} Credits
          </Chip>
          <Button size="sm" radius="full" color="secondary" onPress={onTopUpClick}>
            Buy Credits
          </Button>
        </div>
      </div>
    </div>
  );
};
