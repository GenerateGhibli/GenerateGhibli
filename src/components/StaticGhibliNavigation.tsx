// components/StaticGhibliNavigation.tsx
import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { getNamespaceTranslations, CommonTranslations } from '@/lib/translations'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'

interface StaticGhibliNavigationProps {
  locale: string;
}

export function StaticGhibliNavigation({ locale }: StaticGhibliNavigationProps) {
  // 获取common命名空间下的翻译
  const commonText = getNamespaceTranslations('common', locale) as CommonTranslations;
  
  // 使用翻译的导航项
  const navItems = [
    { path: '/', label: commonText.home },
    { path: '/resources', label: commonText.resources },
    { path: '/posts', label: commonText.tutorials },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link href={`/${locale}`} className="flex items-center space-x-2 group">
            <div className="relative w-10 h-10 bg-ghibli-blue rounded-full overflow-hidden shadow-md group-hover:animate-float transition-all duration-300">
              <div className="relative w-full h-full bg-gradient-to-br from-ghibli-blue to-ghibli-green opacity-80"></div>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white font-serif text-xl">G</div>
            </div>
            <span className="inline-block font-serif text-xl font-bold tracking-wide ghibli-title">GenerateGhibli</span>
          </Link>
          <nav className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={`/${locale}${item.path === '/' ? '' : item.path}`}
                className="flex items-center text-base font-medium ghibli-nav-link text-muted-foreground hover:text-primary"
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
        </div>
      </div>
    </header>
  )
}
