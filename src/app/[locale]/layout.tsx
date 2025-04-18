import '../../app/globals.css'
import { Inter } from 'next/font/google'
import { Layout } from '@/components/Layout'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locales, defaultLocale } from '@/i18n'
import React from 'react'
import Script from 'next/script'

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
        {/* 添加hreflang标签用于SEO多语言支持 */}
        {locales.map((hrefLocale) => (
          <link
            key={hrefLocale}
            rel="alternate"
            hrefLang={hrefLocale}
            href={`https://generateghibli.org/${hrefLocale}`}
          />
        ))}
        {/* 添加一个x-default hreflang标签作为默认语言 */}
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`https://generateghibli.org/${defaultLocale}`}
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        {/* Google Analytics */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-L2RTVSD88G" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-L2RTVSD88G');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <Layout locale={locale}>{children}</Layout>
      </body>
    </html>
  )
}
