import { NextIntlClientProvider } from 'next-intl';
import AdminClient from './AdminClient';
import { getMessages } from '@/i18n/getMessages';

export default async function AdminPage({ params: { locale } }: { params: { locale: string } }) {
  const messages = await getMessages(locale);
  
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AdminClient locale={locale} />
    </NextIntlClientProvider>
  );
}
