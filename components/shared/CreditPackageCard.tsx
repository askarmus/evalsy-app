import { Card, CardBody, Chip, Button } from '@heroui/react';
import { useState } from 'react';

type CreditPackage = {
  credits: number;
  price: number;
  description: string;
  popular?: boolean;
};

type CreditPackageListProps = {
  onBuy: (credits: number) => void;
};

const creditPackages: CreditPackage[] = [
  {
    credits: 50,
    price: 1000, // $10.00
    description: 'Best for light hiring or quick interview sessions.',
    popular: false,
  },
  {
    credits: 200,
    price: 3500, // $35.00
    description: 'Great value for regular hiring needs and mid-sized teams.',
    popular: true,
  },
  {
    credits: 500,
    price: 7500, // $75.00
    description: 'Ideal for agencies and high-volume hiring pipelines.',
    popular: false,
  },
];

export const CreditPackageList = ({ onBuy }: CreditPackageListProps) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {creditPackages.map(({ credits, price, description, popular }) => (
        <Card radius="sm" shadow="sm" key={credits} className="mb-2">
          <CardBody className="flex flex-row justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{credits} Credits</span>
                {popular && (
                  <Chip color="success" className="text-white">
                    Popular
                  </Chip>
                )}
              </div>
              <p className="text-sm text-default-500">${(price / 100).toFixed(2)}</p>
              <p className="text-sm text-default-500">{description}</p>
            </div>
            <Button
              variant="bordered"
              isLoading={isLoading}
              radius="full"
              color="success"
              onPress={() => {
                onBuy(credits);
                setIsLoading(true);
              }}
            >
              Buy
            </Button>
          </CardBody>
        </Card>
      ))}
    </>
  );
};
