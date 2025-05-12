'use client';
import React, { useState, useEffect } from 'react';
import { Tabs, Tab } from '@heroui/react';
import { Breadcrumb } from '@/components/bread.crumb';
import CompanySettings from '@/components/settings/company';
import ChangePassword from '@/components/settings/change.password';
import { CreditProvider } from '@/context/CreditContext';
import { CreditBalanceCard } from '@/components/settings/components/credits/CreditBalanceCard';
import { CreditManager } from '@/components/settings/components/credits/credits/CreditManager';
import { CreditTransactionTable } from '@/components/settings/components/credits/credits/CreditTransactionTable';

const CompanySettingsPage = () => {
  const [activeTab, setActiveTab] = useState('settings');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab('subscriptions');
    }
  }, []);

  const breadcrumbItems = [
    { name: 'Dashboard', link: '/' },
    { name: 'Company', link: '' },
  ];

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[90rem] mx-auto w-full flex flex-col gap-4">
      <Breadcrumb items={breadcrumbItems} />
      <h3 className="text-xl font-semibold">Settings</h3>
      <div className="max-w-[90rem] mx-auto w-full">
        <Tabs aria-label="Options" selectedKey={activeTab} onSelectionChange={(key) => setActiveTab(key as string)}>
          <Tab key="settings" title="Settings">
            <CompanySettings />
          </Tab>
          <Tab key="changePassword" title="Change Password">
            <ChangePassword />
          </Tab>
          <Tab key="subscriptions" title="Subscriptions">
            <CreditProvider>
              <CreditManager />
              <CreditBalanceCard />
            </CreditProvider>
          </Tab>
          <Tab key="creditTransaction" title="Credit Transaction">
            <CreditProvider>
              <div className="space-y-6">
                <CreditTransactionTable />
              </div>
            </CreditProvider>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default CompanySettingsPage;
