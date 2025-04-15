import fs from 'fs'
import path from 'path'
import { getSortedPostsData } from '@/lib/posts'
import { StaticResourceList } from '@/components/StaticResourceList'
import { StaticArticleList } from '@/components/StaticArticleList'
import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'GenerateGhibli - 吉卜力风格AI图像生成资源导航 | Studio Ghibli Style AI Art Generator',
  description: '探索吉卜力风格AI图像生成的完整资源库。收集最佳AI工具、模型和灵感，轻松创建宫崎骏和吉卜力工作室风格的魔幻世界和角色。免费在线生成吉卜力风格图片。',
  keywords: '吉卜力风格, AI图像生成, 宫崎骏, Studio Ghibli, AI艺术, 人工智能绘画, 吉卜力AI, 动漫风格, AI绘画工具, 吉卜力画风',
  openGraph: {
    title: 'GenerateGhibli - 吉卜力风格AI图像生成资源导航',
    description: '探索吉卜力风格AI图像生成的完整资源库。收集最佳AI工具、模型和灵感，轻松创建宫崎骏和吉卜力工作室风格的魔幻世界和角色。',
    url: 'https://generateghibli.org',
    siteName: 'GenerateGhibli',
    images: [
      {
        url: 'https://toimg.xyz/file/5aa892c8e8385232fcdf3.png',
        width: 1200,
        height: 630,
        alt: 'GenerateGhibli - 吉卜力风格AI图像生成资源导航',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GenerateGhibli - 吉卜力风格AI图像生成资源导航',
    description: '探索吉卜力风格AI图像生成的完整资源库。收集最佳AI工具、模型和灵感，轻松创建宫崎骏和吉卜力工作室风格的魔幻世界和角色。',
    images: ['https://toimg.xyz/file/5aa892c8e8385232fcdf3.png'],
  },
  alternates: {
    canonical: 'https://generateghibli.org',
    languages: {
      'en': 'https://generateghibli.org/en',
      'zh': 'https://generateghibli.org/zh',
    },
  },
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
        title: 'GenerateGhibli',
        subtitle: '吉卜力风格AI图像生成资源导航',
        description: '探索创建宫崎骏和吉卜力工作室风格艺术的完整资源库。我们精心收集了最佳AI工具、模型和灵感，帮助您轻松生成充满魔法的梦幻世界、自然风光和令人难忘的角色。无论您是AI艺术爱好者还是吉卜力迷，这里都能找到适合您的资源。',
        exploreButton: '探索资源库',
        learnMore: '查看灵感',
        resourcesTitle: '精选资源',
        articlesTitle: '创作灵感'
      }
    }
    return {
      title: 'GenerateGhibli',
      subtitle: 'Studio Ghibli Style AI Art Generation Resources',
      description: 'Explore a comprehensive collection of resources for creating Hayao Miyazaki and Studio Ghibli style art with AI. Discover curated tools, models, and inspiration to generate magical landscapes, whimsical characters, and enchanted worlds inspired by the beloved animation studio.',
      exploreButton: 'Explore Resources',
      learnMore: 'View Inspiration',
      resourcesTitle: 'Featured Resources',
      articlesTitle: 'Creative Inspiration'
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
        <StaticResourceList resources={resources} locale={params.locale} />
      </section>
      
      {/* Articles Section */}
      <section>
        <StaticArticleList articles={allPostsData} locale={params.locale} />
      </section>
    </div>
  )
}
