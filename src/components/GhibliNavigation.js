'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from './LanguageSwitcher'

export function GhibliNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const t = useTranslations('common')
  
  // 获取当前语言
  const locale = usePathname().split('/')[1];
  
  // 使用翻译的导航项，并添加语言前缀
  const navItems = [
    { path: `/${locale}`, label: t('home') },
    { path: `/${locale}/resources`, label: t('resources') },
    { path: `/${locale}/posts`, label: t('tutorials') },
  ]

  useEffect(() => {
    let isMounted = true;
    const checkLoginStatus = async () => {
      if (!isMounted) return;
      setIsLoading(true);
      try {
        const response = await fetch('/api/check-auth');
        const data = await response.json();
        if (isMounted) setIsLoggedIn(data.isLoggedIn);
      } catch (error) {
        console.error('Failed to check auth status:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    checkLoginStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      setIsLoggedIn(false);
      router.push(`/${locale}`);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link href={`/${locale}`} className="flex items-center space-x-2 group">
            <div className="relative w-10 h-10 bg-ghibli-blue rounded-full overflow-hidden shadow-md group-hover:animate-float transition-all duration-300">
              {/* 修复绝对定位问题，将absolute改为relative并限制在父容器内 */}
              <div className="relative w-full h-full bg-gradient-to-br from-ghibli-blue to-ghibli-green opacity-80"></div>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white font-serif text-xl">G</div>
            </div>
            <span className="inline-block font-serif text-xl font-bold tracking-wide ghibli-title">GhibliHub</span>
          </Link>
          <nav className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center text-base font-medium ghibli-nav-link",
                  item.path === pathname ? "text-primary font-semibold" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {!isLoading && (
            isLoggedIn ? (
              <>
                <Link href={`/${locale}/admin`}>
                  <Button variant="ghost" className="ghibli-button bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    {t('admin')}
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="outline" className="ghibli-button bg-transparent border-primary text-primary hover:bg-primary/10">
                  {t('logout')}
                </Button>
              </>
            ) : (
              <Link href={`/${locale}/login`}>
                <Button className="ghibli-button">
                  {t('login')}
                </Button>
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  )
}
