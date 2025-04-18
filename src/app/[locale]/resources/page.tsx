import React from 'react'
import { Metadata } from 'next'
import { StaticResourceList } from '@/components/StaticResourceList'
import { getResourcesData } from '@/lib/resources'
import { getNamespaceTranslations, ResourcesTranslations } from '@/lib/translations'

export const metadata: Metadata = {
  title: '吉卜力风格AI图像生成工具和资源 | GenerateGhibli',
  description: '探索精选的吉卜力风格AI图像生成工具、模型和资源。轻松创建宫崎骏和吉卜力工作室风格的魔幻世界和角色。',
  keywords: '吉卜力AI工具, 宫崎骏风格生成器, AI绘画模型, 吉卜力艺术资源, Studio Ghibli AI',
}

export default function Resources({ params }: { params: { locale: string } }) {
  // 使用新的资源获取函数，基于当前语言
  const resources = getResourcesData(params.locale);
  
  // 获取翻译
  const resourcesText = getNamespaceTranslations('resources', params.locale) as ResourcesTranslations;

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold ghibli-title">{resourcesText.title}</h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">{resourcesText.description}</p>
      </div>
      <StaticResourceList resources={resources} locale={params.locale} showMoreLink={false} />
    </div>
  )
}
