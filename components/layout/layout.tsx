'use client';

import React from 'react';
import { Header } from '../navbar/navbar';

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  return (
    <section>
      <Header />
      {children}
    </section>
  );
};
