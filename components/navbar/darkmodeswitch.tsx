'use client';
import React from 'react';
import { useTheme as useNextTheme } from 'next-themes';
import { Switch } from '@heroui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

export const DarkModeSwitch = () => {
  const { setTheme, resolvedTheme } = useNextTheme();

  const isDark = resolvedTheme === 'dark';

  return <div className="flex items-center gap-2">{/* <Switch isSelected={isDark} color="secondary" size="sm" onValueChange={(val) => setTheme(val ? 'dark' : 'light')} thumbIcon={({ isSelected, className }) => (isSelected ? <FaSun className={className} /> : <FaMoon className={className} />)} /> */}</div>;
};
