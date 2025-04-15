import fs from 'fs'
import path from 'path'
import { getSortedPostsData } from '@/lib/posts'
import ResourceList from '@/components/ResourceList'
import ArticleList from '@/components/ArticleList'
import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'GhibliHub - 吉卜力风格AI图像生成资源导航 | Studio Ghibli Style AI Art Resources',
  description: '探索吉卜力风格AI图像生成的完整资源库。收集最佳提示词、模型、教程和工具，创建宫崎骏和吉卜力工作室风格的梦幻艺术作品。',
}

export default function Home({ params }: { params: { locale: string } }) {
  const resourcesPath = path.join(process.cwd(), 'data', 'json', 'resources.json')
  let resources = []
  try {
    resources = JSON.parse(fs.readFileSync(resourcesPath, 'utf8'))
  } catch (error) {
    console.error('Error loading resources:', error)
  }
  
  const allPostsData = getSortedPostsData().slice(0, 6)
  
  // 根据当前语言选择文本
  const getText = () => {
    if (params.locale === 'zh') {
      return {
        title: 'GhibliHub',
        subtitle: '吉卜力风格AI图像生成资源导航',
        description: '探索创建宫崎骏和吉卜力工作室风格艺术的完整资源库。我们精心收集了最佳提示词、模型、教程和工具，帮助您轻松生成充满魔法的梦幻世界、自然风光和令人难忘的角色。无论您是AI艺术爱好者还是吉卜力迷，这里都能找到灵感和资源。',
        exploreButton: '探索资源库',
        learnMore: '查看教程',
        resourcesTitle: '精选资源',
        articlesTitle: '最新教程'
      }
    }
    return {
      title: 'GhibliHub',
      subtitle: 'Studio Ghibli Style AI Art Generation Resources',
      description: 'Explore a comprehensive collection of resources for creating Hayao Miyazaki and Studio Ghibli style art with AI. Discover curated prompts, models, tutorials, and tools to generate magical landscapes, whimsical characters, and enchanted worlds inspired by the beloved animation studio.',
      exploreButton: 'Explore Resources',
      learnMore: 'View Tutorials',
      resourcesTitle: 'Featured Resources',
      articlesTitle: 'Latest Tutorials'
    }
  }
  
  const text = getText()

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
            {text.title}
          </h1>
          <h2 className="text-2xl font-serif tracking-wide sm:text-3xl md:text-3xl lg:text-3xl">{text.subtitle}</h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl leading-relaxed">
            {text.description}
          </p>
          <div className="pt-6 flex justify-center gap-4">
            <Link href={`/${params.locale}/resources`}>
              <Button className="ghibli-button text-base px-8 py-6">
                {text.exploreButton}
              </Button>
            </Link>
            <Link href={`/${params.locale}/posts`}>
              <Button variant="outline" className="ghibli-button bg-transparent border-primary text-primary hover:bg-primary/10 text-base px-8 py-6">
                {text.learnMore}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section>
        <h2 className="text-3xl font-serif font-semibold tracking-wide mb-8 ghibli-title">{text.resourcesTitle}</h2>
        <ResourceList resources={resources} />
      </section>
      
      {/* Articles Section */}
      <section>
        <h2 className="text-3xl font-serif font-semibold tracking-wide mb-8 ghibli-title">{text.articlesTitle}</h2>
        <ArticleList articles={allPostsData} />
      </section>
    </div>
  )
}
