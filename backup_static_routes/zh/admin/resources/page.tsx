import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from '@/i18n/getMessages';
import ResourcesClient from '@/app/[locale]/admin/resources/ResourcesClient';

export default async function ResourcesPage() {
  const locale = 'zh';
  const messages = await getMessages(locale);
  
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ResourcesClient locale={locale} />
    </NextIntlClientProvider>
  );
} 