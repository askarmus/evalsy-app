import { Content } from '@/components/home/content';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Evalsy –  Dashboard for Smarter, Faster Hiring',
};
const dashboard = () => {
  return <Content />;
};

export default dashboard;
