import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/index';

export default function LoginRedirect() {
  // 重定向到默认语言的登录页面
  redirect(`/${defaultLocale}/login`);
}
