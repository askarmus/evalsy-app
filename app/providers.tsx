"use client";
import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { ToastProvider } from "@heroui/react";
import "highlight.js/styles/github.css";
export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <HeroUIProvider>
      <NextThemesProvider defaultTheme='system' attribute='class' {...themeProps}>
        <ToastProvider placement='top-right' />

        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
