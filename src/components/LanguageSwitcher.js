'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useLocale } from 'next-intl'
import { locales } from '@/i18n'

export function LanguageSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  const currentLocale = useLocale()

  // 获取当前路径，但移除语言前缀
  const getPathWithoutLocale = () => {
    // 检查路径是否以语言代码开头
    for (const locale of locales) {
      if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
        return pathname.replace(new RegExp(`^/${locale}`), '') || '/'
      }
    }
    return pathname
  }

  const switchLanguage = (locale) => {
    const path = getPathWithoutLocale()
    router.push(`/${locale}${path}`)
  }

  return (
    <div className="flex items-center gap-2">
      {locales.map((locale) => (
        <Button
          key={locale}
          variant={locale === currentLocale ? "default" : "outline"}
          size="sm"
          onClick={() => switchLanguage(locale)}
          className="w-10"
        >
          {locale.toUpperCase()}
        </Button>
      ))}
    </div>
  )
}
