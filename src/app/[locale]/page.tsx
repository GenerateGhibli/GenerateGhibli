import React from 'react'
import { getSortedPostsData } from '@/lib/posts'
import { getResourcesData } from '@/lib/resources'
import { StaticResourceList } from '@/components/StaticResourceList.js'
import { StaticArticleList } from '@/components/StaticArticleList'
import { getNamespaceTranslations, TranslationNamespace } from '@/lib/translations'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Metadata } from 'next'

// 直接在此处定义并导出 generateMetadata 函数
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  // 获取首页的本地化文本
  const homeText = getNamespaceTranslations(params.locale, 'home' as TranslationNamespace);

  // 从 homeText 中获取标题和描述，如果不存在则提供备用值
  const title = homeText.metaTitle || homeText.title || 'GenerateGhibli 首页'; // 优先使用 metaTitle，其次是 h1 标题，最后是默认值
  const description = homeText.metaDescription || homeText.description || '探索吉卜力风格 AI 图像生成的世界，发现工具、模型和灵感。'; // 优先使用 metaDescription，其次是页面描述，最后是默认值

  // （可选）定义 Open Graph 和 Twitter 的特定图片，如果首页需要不同于全局设置的图片
  // const ogImageUrl = '/og-home.jpg'; // 假设首页有特定的 OG 图片

  return {
    title: title, // 设置页面特定标题
    description: description, // 设置页面特定描述
    openGraph: {
      // 可以继承 layout.tsx 中的大部分 OG 设置，但覆盖特定字段
      title: title,
      description: description,
      // 如果首页有特定图片，则覆盖 images
      // images: [
      //   {
      //     url: ogImageUrl,
      //     width: 1200,
      //     height: 630,
      //     alt: title, // 使用页面标题作为 alt 文本
      //   },
      // ],
    },
    twitter: {
       // 可以继承 layout.tsx 中的大部分 Twitter 设置，但覆盖特定字段
      title: title,
      description: description,
      // 如果首页有特定图片，则覆盖 images
      // images: [ogImageUrl],
    },
    // 可以添加页面特定的关键词
    // keywords: ['首页关键词1', '首页关键词2'],
  };
}

export default function Home({ params }: { params: { locale: string } }) {
  // 使用新的数据获取函数，基于当前语言
  const allPostsData = getSortedPostsData(params.locale).slice(0, 6)
  const resources = getResourcesData(params.locale);
  
  // 获取本地化文本
  const homeText = getNamespaceTranslations(params.locale, 'home' as TranslationNamespace);

  return (
    <div className="container mx-auto py-8 space-y-12 md:space-y-16">
      {/* Hero Section with Ghibli-inspired styling */}
      <section className="relative py-16 md:py-20 px-6 rounded-[2rem] overflow-hidden border border-border/60 shadow-ghibli">
        {/* 温暖渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/40 opacity-90"></div>
        
        {/* 装饰性云朵和元素 */}
        <div className="absolute top-10 right-[10%] w-40 h-24 bg-gradient-to-b from-white to-transparent opacity-30 rounded-full blur-md animate-float"></div>
        <div className="absolute top-20 right-[30%] w-24 h-16 bg-gradient-to-b from-white to-transparent opacity-20 rounded-full blur-md animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-10 left-[10%] w-32 h-20 bg-gradient-to-b from-white to-transparent opacity-25 rounded-full blur-md animate-float" style={{ animationDelay: '1s' }}></div>
        
        {/* 草地装饰元素 - 吉卜力风格 */}
        <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-ghibli-green/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 flex">
            {[...Array(24)].map((_, i) => (
              <div 
                key={i} 
                className="relative h-6 w-8 bg-ghibli-leaf/30 rounded-t-full"
                style={{ transform: `translateY(${i % 3 * 2}px)` }}
              >
                <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-ghibli-green/40 to-transparent mix-blend-overlay"></div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 max-w-6xl mx-auto">
          <div className="text-left space-y-6 max-w-2xl">
            <h1 className="text-4xl font-serif font-bold tracking-wide sm:text-5xl md:text-6xl ghibli-title">
              <span className="inline-block bg-gradient-to-r from-primary to-ghibli-teal bg-clip-text text-transparent pb-2">
                {homeText.title}
              </span>
            </h1>
            <h2 className="text-xl font-serif tracking-wide sm:text-2xl opacity-90 text-foreground/90">
              {homeText.subtitle}
            </h2>
            <p className="text-muted-foreground md:text-lg leading-relaxed">
              {homeText.description}
            </p>
            <div className="pt-6 flex flex-wrap gap-4">
              <Link href={`/${params.locale}/resources`}>
                <Button className="ghibli-button text-base px-8 py-6 group">
                  <span className="relative inline-block group-hover:animate-gentle-bounce">{homeText.exploreButton}</span>
                </Button>
              </Link>
              <Link href={`/${params.locale}/posts`}>
                <Button variant="outline" className="bg-transparent border-2 border-primary/70 text-primary hover:bg-primary/10 text-base px-8 py-6 rounded-full hover:shadow-md transition-all">
                  {homeText.learnMore}
                </Button>
              </Link>
            </div>
          </div>
          
          {/* 图片展示卡片 */}
          <div className="relative w-full max-w-md">
            <div className="ghibli-image-frame relative overflow-visible">
              {/* 装饰圆形 */}
              <div className="absolute -top-4 -left-4 w-32 h-32 rounded-full border-4 border-background bg-accent/30 opacity-60 blur-sm z-0 animate-float" style={{animationDelay: '1.5s'}}></div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-full border-4 border-background bg-primary/20 opacity-50 blur-sm z-0 animate-float" style={{animationDelay: '0.8s'}}></div>
              
              <div className="relative z-10 rounded-xl overflow-hidden shadow-ghibli border border-border/30 bg-card">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-60"></div>
                
                <div className="flex flex-col p-4">
                  <div className="w-full aspect-[3/2] relative rounded-lg overflow-hidden mb-4">
                    <div 
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url('/images/posts/WechatIMG100.jpg')` }}
                      role="img"
                      aria-label={homeText.ghibliStyleLabel || "吉卜力风格"}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent mix-blend-overlay"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-lg font-serif font-medium text-foreground px-4 py-1 rounded-full bg-background/40 backdrop-blur-sm">
                        {homeText.ghibliStyleLabel || "吉卜力风格"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="text-sm text-muted-foreground">{homeText.exploreResourcesLabel || "探索精选导航资源"}</div>
                  </div>
                </div>
                
                <div className="p-4 text-center bg-gradient-to-t from-muted/50 to-transparent border-t border-border/20">
                  <p className="text-sm text-foreground/80 font-medium">{homeText.experienceGhibliLabel || "体验吉卜力风格艺术的魅力"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 自然分隔元素 */}
      <div className="relative h-24 flex items-center justify-center overflow-hidden">
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-border/60 to-transparent"></div>
        <div className="relative bg-background px-8 z-10 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" style={{animationDelay: '0.3s'}}></div>
          <div className="w-3 h-3 rounded-full bg-secondary/70 animate-pulse" style={{animationDelay: '0s'}}></div>
          <div className="w-2 h-2 rounded-full bg-accent/60 animate-pulse" style={{animationDelay: '0.6s'}}></div>
        </div>
      </div>

      {/* Resources Section */}
      <section>
        <div className="mb-8 text-center">
          <h2 className="ghibli-title text-3xl md:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-ghibli-brown to-ghibli-rust bg-clip-text text-transparent">
              {homeText.resourcesTitle || "精选资源"}
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{homeText.resourcesDescription || "探索我们精心挑选的资源，帮助您创建梦幻般的吉卜力风格艺术"}</p>
        </div>
        <StaticResourceList resources={resources} locale={params.locale} />
      </section>
      
      {/* 装饰性分隔元素 */}
      <div className="relative h-32 overflow-hidden">
        <div className="absolute inset-x-0 h-24 bg-gradient-to-r from-ghibli-blue/5 via-ghibli-leaf/10 to-ghibli-sand/5 rounded-full blur-xl transform -translate-y-1/2"></div>
      </div>
      
      {/* Articles Section */}
      <section>
        <div className="mb-8 text-center">
          <h2 className="ghibli-title text-3xl md:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-ghibli-teal to-ghibli-sky bg-clip-text text-transparent">
              {homeText.articlesTitle || "最新文章"}
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{homeText.articlesDescription || "了解更多关于吉卜力风格艺术与技术的精彩内容"}</p>
        </div>
        <StaticArticleList articles={allPostsData} locale={params.locale} />
      </section>
      
      {/* 底部装饰元素 */}
      <div className="relative h-20 mt-16 overflow-hidden opacity-70">
        <div className="absolute bottom-0 left-0 right-0 h-20">
          <div className="absolute inset-0 bg-gradient-to-t from-ghibli-green/10 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 flex justify-around">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i}
                className="relative h-4 w-8 bg-ghibli-leaf/20 rounded-t-full"
                style={{ transform: `translateY(${Math.sin(i/2) * 3}px) scale(${0.8 + Math.sin(i/4) * 0.2})` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
