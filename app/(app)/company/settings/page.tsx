'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardBody } from '@heroui/react';

import CompanySettings from '@/components/settings/company';
import ChangePassword from '@/components/settings/change.password';
import { CreditProvider } from '@/context/CreditContext';
import { CreditBalanceCard } from '@/components/settings/components/credits/CreditBalanceCard';
import { CreditManager } from '@/components/settings/components/credits/credits/CreditManager';
import { CreditTransactionTable } from '@/components/settings/components/credits/credits/CreditTransactionTable';

const CompanySettingsPage = () => {
  const [activeTab, setActiveTab] = useState('company');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab('subscriptions');
    }
  }, []);

  const TABS = ['company', 'password', 'subscriptions', 'creditTransaction'];

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[80rem] mx-auto w-full flex flex-col gap-4">
      <Card className="p-4" shadow="none">
        <CardBody>
          <div className="grid lg:grid-cols-4 gap-3">
            <div className="col-span-1">
              <nav className="flex flex-row lg:flex-col gap-2 w-auto lg:w-full bg-default-100 p-1.5 rounded-lg" aria-label="Tabs" role="tablist" aria-orientation="horizontal">
                {TABS.map((tab) => (
                  <button key={tab} type="button" className={`text-start py-2 px-4 rounded bg-transparent transition-all ${activeTab === tab ? 'bg-white text-primary' : 'text-default-700'}`} onClick={() => setActiveTab(tab)} aria-selected={activeTab === tab} role="tab">
                    {tab
                      .replace(/([a-z])([A-Z])/g, '$1 $2')
                      .charAt(0)
                      .toUpperCase() + tab.replace(/([a-z])([A-Z])/g, '$1 $2').slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            <div className="lg:col-span-3 transition-all px-4 h-full">
              {activeTab === 'company' && <CompanySettings />}

              {activeTab === 'password' && <ChangePassword />}

              {activeTab === 'subscriptions' && (
                <CreditProvider>
                  <CreditManager />
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
