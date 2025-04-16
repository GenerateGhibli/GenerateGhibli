import { locales, defaultLocale } from './index';

export async function getMessages(locale) {
  // Validate the requested locale
  if (!locales.includes(locale)) {
    locale = defaultLocale;
  }

  try {
    return (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Could not load messages for locale: ${locale}`, error);
    return (await import(`../../messages/${defaultLocale}.json`)).default;
  }
}
