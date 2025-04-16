import '../../app/globals.css'
import { Inter } from 'next/font/google'
import { Layout } from '@/components/Layout'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'GenerateGhibli',
    template: '%s | GenerateGhibli'
  },
  description: 'Your resource hub for Ghibli-style AI image generation. Discover curated AI tools, models, and inspiration to create magical worlds and characters in the style of Miyazaki and Studio Ghibli.',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const locale = 'en';

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
