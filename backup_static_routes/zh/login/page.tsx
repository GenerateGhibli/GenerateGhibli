import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from '@/i18n/getMessages';
import LoginClient from '../../[locale]/login/LoginClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '登录 | GenerateGhibli',
  description: '登录到GenerateGhibli管理面板',
};

export default async function LoginPage() {
  const locale = 'zh';
  const messages = await getMessages(locale);
  
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LoginClient locale={locale} />
    </NextIntlClientProvider>
  );
}
