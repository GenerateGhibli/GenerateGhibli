import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from '@/i18n/getMessages';
import CreatePostClient from '../../../[locale]/admin/create-post/CreatePostClient';

export default async function CreatePostPage() {
  const locale = 'en';
  const messages = await getMessages(locale);
  
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <CreatePostClient locale={locale} />
    </NextIntlClientProvider>
  );
} 