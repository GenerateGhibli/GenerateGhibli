import { NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n';

export async function middleware(request) {
  // 获取请求路径名
  const pathname = request.nextUrl.pathname;
  
  // 特殊处理不带语言前缀的admin和login路径
  if (pathname === '/admin' || pathname === '/login' || pathname.startsWith('/admin/') || pathname.startsWith('/login/')) {
    // 对于管理员路径，检查认证
    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
      const token = request.cookies.get('auth_token')?.value;
      
      // 如果没有token，重定向到默认语言的登录页面
      if (!token) {
        return NextResponse.redirect(new URL(`/${defaultLocale}/login`, request.url));
      }
    }
    
    // 将不带语言前缀的路径重定向到默认语言
    const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url);
    newUrl.search = request.nextUrl.search;
    return NextResponse.redirect(newUrl);
  }
  
  // 检查路径是否已经包含语言前缀
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  // 如果路径已经包含语言前缀
  if (pathnameHasLocale) {
    // 获取当前语言
    const locale = pathname.split('/')[1];
    
    // 检查管理员路由的认证
    if (pathname.includes('/admin')) {
      const token = request.cookies.get('auth_token')?.value;
      
      // 如果没有token，直接重定向到登录页面
      if (!token) {
        return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
      }
    }
    
    // 不做其他处理，允许用户继续访问
    return NextResponse.next();
  }
  
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
