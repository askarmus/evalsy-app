'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardBody } from '@heroui/react';

import CompanySettings from '@/components/settings/company';
import ChangePassword from '@/components/settings/change.password';
import { CreditProvider } from '@/context/CreditContext';
import { CreditBalanceCard } from '@/components/settings/components/credits/CreditBalanceCard';
import { CreditTransactionTable } from '@/components/settings/components/credits/credits/CreditTransactionTable';
import { ArrowLeftRight, Building, Building2, CreditCard, KeyRound, Lock } from 'lucide-react';

const CompanySettingsPage = () => {
  const [activeTab, setActiveTab] = useState('settings');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab('subscriptions');
    }
  }, []);

  const TABS = [
    { key: 'settings', label: 'Settings', icon: Building },
    { key: 'password', label: 'Password', icon: Lock },

    { key: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { key: 'creditTransaction', label: 'Credit Transaction', icon: ArrowLeftRight },
  ];
  return (
    <div className="my-10 px-4 lg:px-6   max-w-[94rem]   mx-auto w-full  flex flex-col gap-4">
      <Card className="P-3  ">
        <CardBody>
          <div className="grid lg:grid-cols-4 gap-3">
            <div className="col-span-1 p-4">
              <nav className="flex flex-row lg:flex-col gap-2 w-auto lg:w-full bg-secondary-500 p-1.5 rounded-xl" aria-label="Tabs" role="tablist" aria-orientation="horizontal">
                {TABS.map(({ key, label, icon: Icon }) => (
                  <button key={key} type="button" className={`flex items-center gap-2 text-start py-2 px-4 rounded-lg transition-colors duration-200 ${activeTab === key ? 'bg-white text-black' : 'text-white hover:bg-secondary-400'}`} onClick={() => setActiveTab(key)} aria-selected={activeTab === key} role="tab">
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="lg:col-span-3 transition-all px-4 h-full">
              {activeTab === 'settings' && <CompanySettings />}

              {activeTab === 'password' && <ChangePassword />}

              {activeTab === 'subscriptions' && (
                <CreditProvider>
                  <CreditBalanceCard />
                </CreditProvider>
              )}

              {activeTab === 'creditTransaction' && <CreditTransactionTable />}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CompanySettingsPage;
