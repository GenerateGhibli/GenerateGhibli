import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from '@/i18n/getMessages';
import CreatePostClient from './CreatePostClient';

export default async function CreatePostPage({ params: { locale } }: { params: { locale: string } }) {
  const messages = await getMessages(locale);
  
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <CreatePostClient locale={locale} />
    </NextIntlClientProvider>
  );
}
