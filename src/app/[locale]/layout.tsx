import '../../app/globals.css'
import { Inter } from 'next/font/google'
import { Layout } from '@/components/Layout'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'GitBase',
    template: '%s | GitBase'
  },
  description: 'Open source dynamic website without database, built with Next.js and GitHub API',
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
      <body className={inter.className}>
        <Layout locale={locale}>{children}</Layout>
      </body>
    </html>
  )
}
