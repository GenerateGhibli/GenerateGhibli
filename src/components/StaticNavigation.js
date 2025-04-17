import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'

export function StaticNavigation({ locale }) {
  // 根据当前语言选择导航项文本
  const getNavText = () => {
    if (locale === 'zh') {
      return {
        home: '首页',
        resources: 'AI资源',
        posts: '教程指南',
        login: '登录',
        admin: '管理'
      }
    }
    return {
      home: 'Home',
      resources: 'AI Resources',
      posts: 'Tutorials',
      login: 'Login',
      admin: 'Admin'
    }
  }
  
  const navText = getNavText()
  
  // 静态导航项
  const navItems = [
    { path: `/${locale}`, label: navText.home },
    { path: `/${locale}/resources`, label: navText.resources },
    { path: `/${locale}/posts`, label: navText.posts },
  ]

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
                className="flex items-center text-base font-medium ghibli-nav-link text-muted-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <span>{locale.toUpperCase()}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild className={locale === 'en' ? "font-medium bg-secondary" : ""}>
                <Link href="/en">🇬🇧 English</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className={locale === 'zh' ? "font-medium bg-secondary" : ""}>
                <Link href="/zh">🇨🇳 中文</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href={`/${locale}/login`}>
            <Button className="ghibli-button">{navText.login}</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
