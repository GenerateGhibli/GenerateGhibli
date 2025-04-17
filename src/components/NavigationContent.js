'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from './LanguageSwitcher'

export function NavigationContent() {
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
    { path: `/${locale}/posts`, label: t('posts') },
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
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <span className="inline-block font-bold">GitBase</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center text-sm font-medium text-muted-foreground",
                  item.path === pathname && "text-foreground"
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
                  <Button variant="ghost">{t('admin')}</Button>
                </Link>
                <Button onClick={handleLogout} variant="outline">{t('logout')}</Button>
              </>
            ) : (
              <Link href={`/${locale}/login`}>
                <Button>{t('login')}</Button>
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  )
}
