// components/StaticGhibliNavigation.js
import Link from 'next/link'
import { Github } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function StaticGhibliNavigation({ locale }) {
  // 使用翻译的导航项
  const navItems = [
    { path: '/', label: locale === 'zh' ? '首页' : 'Home' },
    { path: '/resources', label: locale === 'zh' ? 'AI工具' : 'AI Tools' },
    { path: '/posts', label: locale === 'zh' ? '创作灵感' : 'Inspiration' },
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
          <Link
            href="https://github.com/GenerateGhibli/GenerateGhibli"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/en">
              <Button
                variant={locale === 'en' ? "default" : "outline"}
                size="sm"
                className="w-10"
              >
                EN
              </Button>
            </Link>
            <Link href="/zh">
              <Button
                variant={locale === 'zh' ? "default" : "outline"}
                size="sm"
                className="w-10"
              >
                中文
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
