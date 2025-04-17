import React from 'react'
import { Metadata } from 'next'
import { StaticResourceList } from '@/components/StaticResourceList'

// 静态导入资源数据
import resourcesData from '../../../../data/json/resources.json'

export const metadata: Metadata = {
  title: '吉卜力风格AI图像生成工具和资源 | GenerateGhibli',
  description: '探索精选的吉卜力风格AI图像生成工具、模型和资源。轻松创建宫崎骏和吉卜力工作室风格的魔幻世界和角色。',
  keywords: '吉卜力AI工具, 宫崎骏风格生成器, AI绘画模型, 吉卜力艺术资源, Studio Ghibli AI',
}

export default function Resources({ params }: { params: { locale: string } }) {
  // 使用静态导入的资源数据
  const resources = resourcesData;
  
  // 根据当前语言选择文本
  const getText = () => {
    if (params.locale === 'zh') {
      return {
        title: '吉卜力风格AI生成工具',
        description: '探索精选的吉卜力风格AI图像生成工具、模型和资源。轻松创建宫崎骏和吉卜力工作室风格的魔幻世界和角色。'
      }
    }
    return {
      title: 'Ghibli Style AI Generation Tools',
      description: 'Explore curated AI tools, models, and resources for creating Studio Ghibli style art. Generate magical worlds and characters in the beloved Miyazaki style.'
    }
  }
  
  const text = getText()

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold ghibli-title">{text.title}</h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">{text.description}</p>
      </div>
      <StaticResourceList resources={resources} locale={params.locale} showMoreLink={false} />
    </div>
  )
}
