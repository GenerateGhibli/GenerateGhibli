import '../../app/globals.css'
import { Inter } from 'next/font/google'
import { Layout } from '@/components/Layout'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'GenerateGhibli',
    template: '%s | GenerateGhibli'
  },
  description: '吉卜力风格AI图像生成资源导航，收集最佳AI工具、模型和灵感，轻松创建宫崎骏和吉卜力工作室风格的魔幻世界和角色。',
}

interface RootLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

export default async function RootLayout({ children, params: { locale } }: RootLayoutProps) {
  // 验证语言是否支持
  if (!locales.includes(locale)) notFound();

  return (
    <html lang={locale}>
      <head>
        <link rel="canonical" href={`https://generateghibli.org/${locale}`} />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={inter.className}>
        <Layout locale={locale}>{children}</Layout>
      </body>
    </html>
  )
}
