import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {locales, defaultLocale} from './index';
 
export default getRequestConfig(async ({locale}) => {
  // 验证请求的语言是否在支持列表中
  if (!locales.includes(locale)) notFound();
 
  try {
    return {
      messages: (await import(`../../messages/${locale}.json`)).default
    };
  } catch (error) {
    console.error(`Could not load messages for locale: ${locale}`, error);
    return {
      messages: (await import(`../../messages/${defaultLocale}.json`)).default
    };
  }
});
