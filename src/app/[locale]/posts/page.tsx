import { getSortedPostsData } from '@/lib/posts'
import { StaticArticleList } from '@/components/StaticArticleList'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '吉卜力风格AI创作文章和教程 | GenerateGhibli',
  description: '探索吉卜力风格AI艺术创作的文章、教程和技巧。学习如何使用AI工具创建宫崎骏和吉卜力工作室风格的魔幻世界和角色。',
  keywords: '吉卜力创作教程, AI艺术教程, 宫崎骏风格指南, 吉卜力提示词, Studio Ghibli AI技巧',
}

export default function Posts({ params }: { params: { locale: string } }) {
  const allPostsData = getSortedPostsData()
  
  // 根据当前语言选择文本
  const getText = () => {
    if (params.locale === 'zh') {
      return {
        title: '吉卜力风格创作文章',
        description: '探索吉卜力风格AI艺术创作的文章、教程和技巧。学习如何使用AI工具创建宫崎骏和吉卜力工作室风格的魔幻世界和角色。'
      }
    }
    return {
      title: 'Ghibli Style Creation Articles',
      description: 'Explore articles, tutorials, and tips for creating Studio Ghibli style AI art. Learn how to use AI tools to generate magical worlds and characters in the beloved Miyazaki style.'
    }
  }
  
  const text = getText()

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold ghibli-title">{text.title}</h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">{text.description}</p>
      </div>
      <StaticArticleList articles={allPostsData} locale={params.locale} />
    </div>
  )
}
