import { NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n/index';

export function middleware(request) {
  // 获取请求路径名
  const pathname = request.nextUrl.pathname;
  
  // 检查路径是否已经包含语言前缀
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  // 如果路径已经包含语言前缀，不做任何处理
  if (pathnameHasLocale) return NextResponse.next();
  
  // 如果路径是根路径或不包含语言前缀，重定向到默认语言
  const newUrl = new URL(
    `/${defaultLocale}${pathname === '/' ? '' : pathname}`,
    request.url
  );
  
  // 保留查询参数
  newUrl.search = request.nextUrl.search;
  
  return NextResponse.redirect(newUrl);
}

export const config = {
  // 匹配所有路径，除了以下路径
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
