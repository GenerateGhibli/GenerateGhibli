import { NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n';

export async function middleware(request) {
  // 获取请求路径名
  const pathname = request.nextUrl.pathname;
  
  // 检查路径是否已经包含语言前缀
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  // 如果路径已经包含语言前缀，不做任何处理
  if (pathnameHasLocale) {
    // 检查管理员路由的认证
    if (pathname.includes('/admin')) {
      const token = request.cookies.get('auth_token')?.value;
      
      // 如果没有token，直接重定向到登录页面
      if (!token) {
        // 获取当前语言
        const locale = pathname.split('/')[1];
        // 重定向到登录页面，保留语言设置
        return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
      }
      
      // 如果有token，我们接受它并在客户端进行更详细的验证
      // 这是为了避免Edge Runtime中的限制
      // 真正的验证将在客户端组件中进行
    }
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
