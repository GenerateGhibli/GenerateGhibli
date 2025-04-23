import '../../app/globals.css'
import { Inter } from 'next/font/google'
import { Layout } from '@/components/Layout'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locales, defaultLocale } from '@/i18n'
import React from 'react'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

// 定义网站基础 URL
const siteUrl = 'https://generateghibli.org';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl), // 设置 metadataBase 以便相对路径正确解析
  title: {
    default: 'GenerateGhibli - 吉卜力风格 AI 图像生成器与资源导航', // 优化默认标题
    template: '%s | GenerateGhibli'
  },
  description: '探索吉卜力风格 AI 图像生成。GenerateGhibli 汇集 AI 工具、模型与灵感，助您创作宫崎骏般的魔幻世界与角色。', // 精简描述 < 160 字符
  keywords: ['吉卜力', '宫崎骏', 'AI图像生成', 'AI绘画', 'Stable Diffusion', 'Midjourney', '动画风格', 'AI艺术'], // 添加一些核心关键词
  openGraph: {
    title: {
      default: 'GenerateGhibli - 吉卜力风格 AI 图像生成器与资源导航', // OG 标题
      template: '%s | GenerateGhibli'
    },
    description: '探索吉卜力风格 AI 图像生成。GenerateGhibli 汇集 AI 工具、模型与灵感，助您创作宫崎骏般的魔幻世界与角色。', // 精简描述 < 160 字符
    url: siteUrl, // 网站 URL
    siteName: 'GenerateGhibli', // 网站名称
    // 注意：请确保 public/og-image.jpg 文件存在，或者替换为正确的图片路径
    images: [
      {
        url: '/og-image.jpg', // OG 图片路径
        width: 1200,
        height: 630,
        alt: 'GenerateGhibli 网站预览图', // OG 图片描述
      },
    ],
    locale: defaultLocale, // 默认语言
    alternateLocale: locales.filter(l => l !== defaultLocale), // 其他支持的语言
    type: 'website', // 类型为网站
  },
  twitter: {
    card: 'summary_large_image', // Twitter 卡片类型
    title: {
      default: 'GenerateGhibli - 吉卜力风格 AI 图像生成器与资源导航', // Twitter 标题
      template: '%s | GenerateGhibli'
    },
    description: '探索吉卜力风格 AI 图像生成。GenerateGhibli 汇集 AI 工具、模型与灵感，助您创作宫崎骏般的魔幻世界与角色。', // 精简描述 < 160 字符
    // 注意：请确保 public/og-image.jpg 文件存在，或者替换为正确的图片路径
    images: ['/og-image.jpg'], // Twitter 图片路径
    // 如果有 Twitter 账号，可以取消注释并替换
    // creator: '@YourTwitterHandle',
    // site: '@YourTwitterHandle',
  },
  // robots 和 viewport 已在 <head> 中设置，也可在此处定义以保持一致性
  // robots: { index: true, follow: true },
  // viewport: { width: 'device-width', initialScale: 1 },
  // icons 已在 <head> 中设置，也可在此处定义
  // icons: { icon: '/favicon.jpg', apple: '/favicon.jpg', shortcut: '/favicon.jpg' },
  // manifest: '/site.webmanifest', // 如果有 PWA manifest 文件
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
        {/* 网站图标设置 */}
        <link rel="icon" href="/favicon.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/favicon.jpg" />
        <link rel="shortcut icon" href="/favicon.jpg" type="image/jpeg" />
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
