
'use client';
import React from 'react';
import '../globals.css';
import { I18nProviderClient } from '@/locales/client';
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from '@/context/UserContext';

export default function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = React.use(params);
  return (
    <UserProvider>
      <I18nProviderClient locale={locale}>
        {children}
        <Toaster />
      </I18nProviderClient>
    </UserProvider>
  );
}
