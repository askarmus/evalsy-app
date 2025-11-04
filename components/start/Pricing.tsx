'use client';

import { Select, SelectItem } from '@heroui/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';

export const Pricing = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [currency, setCurrency] = useState('USD');
  const [rates, setRates] = useState<{ [key: string]: number }>({});
  const [loadingRates, setLoadingRates] = useState(true);
  const [loadingPlans, setLoadingPlans] = useState(true);

  // ✅ Fetch pricing plans from backend
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pricing`);
        const data = await res.json();
        setPlans(data.plans || []);
      } catch (err) {
        console.error('❌ Failed to fetch pricing:', err);
      } finally {
        setLoadingPlans(false);
      }
    };
    fetchPricing();
  }, []);

  // ✅ Fetch exchange rates from open.er-api.com (no API key required)
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await res.json();
        if (data?.rates) setRates(data.rates);
      } catch (err) {
        console.error('❌ Currency fetch failed:', err);
      } finally {
        setLoadingRates(false);
      }
    };
    fetchRates();
  }, []);

  // ✅ Convert USD → selected currency
  const convert = (usd: number) => {
    if (!rates || !rates[currency]) return `$${usd.toFixed(2)} USD`;
    const converted = usd * rates[currency];
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(converted);
  };

  if (loadingPlans) return <div className="text-center py-20 text-lg font-medium">Loading pricing…</div>;

  return (
    <section id="pricing" className="bg-gradient-6 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ===== Header ===== */}
        <div className="text-center">
          <h2 className="font-display text-4xl font-semibold text-[#262626]">
            Simple <span className="gradients-primary-2-text-hard">Pay-as-You-Go Pricing</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">Buy credits once and use them anytime — no subscriptions, no expiry.</p>

          {/* Currency Selector */}
          <div className="mt-6">
            <Select
              selectedKeys={[currency]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setCurrency(selected);
              }}
              className="max-w-xs mx-auto"
              variant="bordered"
              color="secondary"
              radius="md"
            >
              <SelectItem key="USD">🇺🇸 USD — Dollar</SelectItem>
              <SelectItem key="GBP">🇬🇧 GBP — Pound</SelectItem>
              <SelectItem key="EUR">🇪🇺 EUR — Euro</SelectItem>
              <SelectItem key="LKR">🇱🇰 LKR — Rupee</SelectItem>
              <SelectItem key="INR">🇮🇳 INR — Rupee</SelectItem>
              <SelectItem key="AUD">🇦🇺 AUD — Dollar</SelectItem>
            </Select>
          </div>
        </div>

        {/* ===== Pricing Grid ===== */}
        <div className="mt-16 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 gap-x-6">
          {/* === Free Trial === */}

          {/* === Dynamic Plans === */}
          {plans.map((plan) => (
            <div key={plan.id} className={`p-8 shadow-2xl rounded-2xl ${plan.id === 'business' ? 'bg-gradient-to-b from-purple-600 to-indigo-600 text-white' : 'bg-white text-gray-800'}`}>
              <h3 className="text-2xl font-semibold">{plan.name}</h3>
              <p className="mt-1 text-sm opacity-80">{plan.idealFor}</p>

              <ul className="mt-6 space-y-4 text-sm">
                <li className="flex items-center">
                  <AiOutlineCheckCircle className={`${plan.id === 'business' ? 'text-white' : 'text-[#5B21B6]'} mr-3 h-5 w-5`} />
                  {plan.credits} credits — never expire
                </li>

                <li className="flex items-center">
                  <AiOutlineCheckCircle className={`${plan.id === 'business' ? 'text-white' : 'text-[#5B21B6]'} mr-3 h-5 w-5`} />
                  Resume — <strong>{convert(plan.estimatedCost.resumeUSD)} / resume</strong>
                </li>

                <li className="flex items-center">
                  <AiOutlineCheckCircle className={`${plan.id === 'business' ? 'text-white' : 'text-[#5B21B6]'} mr-3 h-5 w-5`} />
                  AI Interview — <strong>{convert(plan.estimatedCost.interview10MinUSD)} / 10 min</strong>
                </li>

                <li className="flex items-center">
                  <AiOutlineCheckCircle className={`${plan.id === 'business' ? 'text-white' : 'text-[#5B21B6]'} mr-3 h-5 w-5`} />
                  Price — <strong>{convert(plan.priceUSD)}</strong>
                </li>
              </ul>
            </div>
          ))}
        </div>

        {/* ===== CTA ===== */}
        <div className="mt-12 text-center">
          <Link href="/signup" className="mt-8 inline-block rounded-full bg-[#5B21B6] text-white font-semibold py-3 px-10 text-lg shadow-lg shadow-purple-500/30 hover:bg-[#4C1D95] transition-all duration-300">
            Try for Free
          </Link>
          <p className="text-sm mt-3 text-gray-600">Start with 10 free credits — no credit card required.</p>
        </div>
      </div>
    </section>
  );
};
