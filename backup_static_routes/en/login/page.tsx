import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from '@/i18n/getMessages';
import LoginClient from '../../[locale]/login/LoginClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | GenerateGhibli',
  description: 'Login to GenerateGhibli admin panel',
};

export default async function LoginPage() {
  const locale = 'en';
  const messages = await getMessages(locale);
  
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LoginClient locale={locale} />
    </NextIntlClientProvider>
  );
}
