"use client";
import React from "react";
import { Tabs, Tab } from "@heroui/react";
import { Breadcrumb } from "@/components/bread.crumb";
import CompanySettings from "@/components/settings/company";
import ChangePassword from "@/components/settings/change.password";
import SubscribePage from "@/components/settings/subscription";
import { useSearchParams } from "next/navigation";

const CompanySettingsPage = () => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "settings"; // Default to 'settings' if no tab is specified

  const breadcrumbItems = [
    { name: "Dashboard", link: "/" },
    { name: "Company", link: "" },
  ];

  return (
    <div className='my-10 px-4 lg:px-6 max-w-[90rem] mx-auto w-full flex flex-col gap-4'>
      <Breadcrumb items={breadcrumbItems} />

      <h3 className='text-xl font-semibold'>Settings</h3>

      <div className='max-w-[90rem] mx-auto w-full'>
        <Tabs aria-label='Options' defaultSelectedKey={activeTab}>
          <Tab key='settings' title='Settings'>
            <CompanySettings />
          </Tab>
          <Tab key='changePassword' title='Change Password'>
            <ChangePassword />
          </Tab>
          <Tab key='subscriptions' title='Subscriptions'>
            <SubscribePage />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default CompanySettingsPage;
