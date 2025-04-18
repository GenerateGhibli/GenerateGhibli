import React from 'react'
import { getSortedPostsData } from '@/lib/posts'
import { getResourcesData } from '@/lib/resources'
import { StaticResourceList } from '@/components/StaticResourceList'
import { StaticArticleList } from '@/components/StaticArticleList'
import { generateMetadata as generatePageMetadata } from '@/lib/metadata'
import { getNamespaceTranslations, TranslationNamespace } from '@/lib/translations'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Metadata } from 'next'

// 静态导出元数据生成函数
export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return generatePageMetadata({ locale: params.locale });
}

export default function Home({ params }: { params: { locale: string } }) {
  // 使用新的数据获取函数，基于当前语言
  const allPostsData = getSortedPostsData(params.locale).slice(0, 6)
  const resources = getResourcesData(params.locale);
  
  // 获取本地化文本
  const homeText = getNamespaceTranslations(params.locale, 'home' as TranslationNamespace);

  return (
    <div className="container mx-auto py-8 space-y-16">
      {/* Hero Section with Ghibli-inspired styling */}
      <section className="relative py-16 px-4 rounded-3xl overflow-hidden bg-gradient-to-b from-background to-secondary/10 border border-border shadow-ghibli">
        {/* 降低背景图案的不透明度 */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('/ghibli-bg-pattern.png')] bg-repeat"></div>
        
        {/* 降低装饰元素的不透明度和模糊度 */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-primary/5 rounded-full blur-2xl"></div>
        
        <div className="relative text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-4xl font-serif font-bold tracking-wide sm:text-5xl md:text-6xl lg:text-7xl ghibli-title">
            {homeText.title}
          </h1>
          <h2 className="text-2xl font-serif tracking-wide sm:text-3xl md:text-3xl lg:text-3xl">{homeText.subtitle}</h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl leading-relaxed">
            {homeText.description}
          </p>
          <div className="pt-6 flex justify-center gap-4">
            <Link href={`/${params.locale}/resources`}>
              <Button className="ghibli-button text-base px-8 py-6">
                {homeText.exploreButton}
              </Button>
            </Link>
            <Link href={`/${params.locale}/posts`}>
              <Button variant="outline" className="ghibli-button bg-transparent border-primary text-primary hover:bg-primary/10 text-base px-8 py-6">
                {homeText.learnMore}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section>
        <StaticResourceList resources={resources} locale={params.locale} />
      </section>
      
      {/* Articles Section */}
      <section>
        <StaticArticleList articles={allPostsData} locale={params.locale} />
      </section>
    </div>
  )
}
