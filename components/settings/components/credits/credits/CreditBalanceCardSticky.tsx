import { useCredits } from '@/context/CreditContext';
import { Card, CardBody, Button, Spinner } from '@heroui/react';

type CreditBalanceCardStickyProps = {
  onTopUpClick: () => void;
};

export const CreditBalanceCardSticky = ({ onTopUpClick }: CreditBalanceCardStickyProps) => {
  const { credits, loading } = useCredits();

  return (
    <Card shadow="none" className="fixed top-20 right-4 z-50 p-1">
      <CardBody>
        <h2 className="text-xs font-semibold mb-1">Your Credit Balance</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm font-semibold">{loading ? <Spinner size="sm" /> : credits} Credits</div>
            <Button size="sm" className="bg-gradient-to-r from-purple-500 text-white to-indigo-600 hover:from-purple-600 hover:to-indigo-700" onPress={onTopUpClick}>
              Top Up
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
