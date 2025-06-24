'use client';

import React from 'react';
import { useLockedBody } from '../hooks/useBodyLock';
import { Header } from '../navbar/navbar';

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [_, setLocked] = useLockedBody(false);
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setLocked(!sidebarOpen);
  };

  return (
    <section>
      <Header />
      {children}
    </section>
  );
};
