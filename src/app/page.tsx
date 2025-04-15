import fs from 'fs'
import path from 'path'
import { getSortedPostsData } from '@/lib/posts'
import ResourceList from '@/components/ResourceList'
import ArticleList from '@/components/ArticleList'
import { Metadata } from 'next'
import { StaticNavigation } from '@/components/StaticNavigation'
import { StaticFooter } from '@/components/StaticFooter'
import { defaultLocale } from '@/i18n/index'

export const metadata: Metadata = {
  title: 'GitBase - Open Source Dynamic Website CMS Without Database',
  description: 'A Next.js site with Tailwind & Shadcn/UI, using GitHub API for content management. No database needed for dynamic updates.',
}

export default function Home() {
  const resourcesPath = path.join(process.cwd(), 'data', 'json', 'resources.json')
  let resources = []
  try {
    resources = JSON.parse(fs.readFileSync(resourcesPath, 'utf8'))
  } catch (error) {
    console.error('Error loading resources:', error)
  }
  
  const allPostsData = getSortedPostsData().slice(0, 6)
  
  // 使用默认语言
  const locale = defaultLocale

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <StaticNavigation locale={locale} />
      <div className="container mx-auto py-12 space-y-16">
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            GitBase
          </h1>
          <h2 className="text-2xl tracking-tighter sm:text-3xl md:text-3xl lg:text-3xl">Open Source Dynamic Website CMS Without Database</h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
            GitBase is a dynamic, database-free website built with Next.js, Tailwind CSS, and Shadcn/UI, featuring a content management system powered by the GitHub API for seamless updates and administration.
          </p>
        </section>

        <ResourceList resources={resources} />
        <ArticleList articles={allPostsData} />
      </div>
      <StaticFooter locale={locale} />
    </div>
  )
}