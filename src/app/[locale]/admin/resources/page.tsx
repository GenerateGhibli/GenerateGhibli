import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from '@/i18n/getMessages';
import ResourcesClient from './ResourcesClient';

export default async function ResourcesPage({ params: { locale } }: { params: { locale: string } }) {
  const messages = await getMessages(locale);
  
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ResourcesClient locale={locale} />
    </NextIntlClientProvider>
  );
}
