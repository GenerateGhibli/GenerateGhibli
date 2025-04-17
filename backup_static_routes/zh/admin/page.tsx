import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from '@/i18n/getMessages';
import AdminClient from '@/app/[locale]/admin/AdminClient';

export default async function AdminPage() {
  const locale = 'zh';
  const messages = await getMessages(locale);
  
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AdminClient locale={locale} />
    </NextIntlClientProvider>
  );
} 