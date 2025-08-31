import { useCredits } from '@/context/CreditContext';
import { Button } from '@heroui/react';
import { Info, ArrowUp } from 'lucide-react';

type CreditBalanceCardStickyProps = {
  onTopUpClick: () => void;
};

export const CreditBalanceCardSticky = ({ onTopUpClick }: CreditBalanceCardStickyProps) => {
  const { credits, loading } = useCredits();

  return (
    <div className="p-4 border-t border-gray-200 dark:border-[#3f3f46]">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium  ">Credits Balance</span>
          <Info className="w-4 h-4 text-gray-400" />
        </div>
        <div className="text-sm mb-2">
          <span className="font-medium">Balance</span> <span className="font-medium"> ({credits})</span>
        </div>
      </div>
      <Button isLoading={loading} className="w-full " color="secondary" onPress={onTopUpClick}>
        <ArrowUp className="w-4 h-4 mr-2" />
        Buy Credits
      </Button>
    </div>
  );
};
