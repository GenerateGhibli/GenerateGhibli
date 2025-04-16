import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from '@/i18n/getMessages';
import LoginClient from './LoginClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | GenerateGhibli',
  description: '登录到GenerateGhibli管理面板',
};

export default async function LoginPage({ params: { locale } }: { params: { locale: string } }) {
  const messages = await getMessages(locale);
  
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LoginClient locale={locale} />
    </NextIntlClientProvider>
  );
}
