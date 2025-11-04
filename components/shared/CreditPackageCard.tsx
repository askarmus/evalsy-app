'use client';

import { Card, CardBody, Chip, Button } from '@heroui/react';
import { useEffect, useState } from 'react';

type CreditPackage = {
  id?: string;
  name?: string;
  credits: number;
  priceUSD: number;
  description?: string;
  popular?: boolean;
};

type CreditPackageListProps = {
  onBuy: (credits: number) => void;
};

export const CreditPackageList = ({ onBuy }: CreditPackageListProps) => {
  const [creditPackages, setCreditPackages] = useState<CreditPackage[]>([]);
  const [loadingCredits, setLoadingCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch data from your backend /pricing endpoint
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pricing`);
        const data = await res.json();

        // Assume your /api/pricing returns { plans: [...] }
        if (data?.plans) {
          const packages = data.plans.map((plan: any) => ({
            id: plan.id,
            name: plan.name,
            credits: plan.credits,
            priceUSD: plan.priceUSD,
            description: plan.idealFor,
            popular: plan.id === 'business', // Mark Business as popular
          }));
          setCreditPackages(packages);
        } else {
          console.warn('⚠️ Unexpected pricing data format', data);
        }
      } catch (err) {
        console.error('❌ Failed to fetch credit packages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) return <div className="text-center py-6 text-default-500">Loading credit packages…</div>;

  return (
    <>
      {creditPackages.map(({ id, name, credits, priceUSD, description, popular }) => (
        <Card radius="sm" shadow="sm" key={id || credits} className="mb-3 hover:shadow-md transition-all">
          <CardBody className="flex flex-row justify-between items-center">
            <div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold">{credits} Credits</span>
                {popular && (
                  <Chip color="secondary" size="sm" variant="flat">
                    Popular
                  </Chip>
                )}
              </div>
              <p className="text-sm text-default-500 font-medium">${priceUSD.toFixed(2)}</p>
              {description && <p className="text-sm text-default-400">{description}</p>}
            </div>

            <Button
              variant="flat"
              size="sm"
              isLoading={loadingCredits === credits}
              radius="full"
              color="secondary"
              onPress={() => {
                setLoadingCredits(credits);
                onBuy(credits);
                setTimeout(() => setLoadingCredits(null), 1000);
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
