import { getSortedPostsData } from '@/lib/posts'
import ArticleList from '@/components/ArticleList'
import { Metadata } from 'next'
import { StaticNavigation } from '@/components/StaticNavigation'
import { StaticFooter } from '@/components/StaticFooter'
import { defaultLocale } from '@/i18n/index'

export const metadata = {
  title: 'Posts - GitBase',
  description: 'Read the latest articles and tutorials about GitBase and web development.',
}

export default function Posts() {
  const allPostsData = getSortedPostsData()
  
  // 使用默认语言
  const locale = defaultLocale

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <StaticNavigation locale={locale} />
      <div className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-gray-500 mt-2">Read the latest articles and tutorials about GitBase and web development.</p>
        </div>
        <ArticleList articles={allPostsData} />
      </div>
      <StaticFooter locale={locale} />
    </div>
  )
}
