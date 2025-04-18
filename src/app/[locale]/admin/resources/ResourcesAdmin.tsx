import React from 'react'
import dynamic from 'next/dynamic'
import { getNamespaceTranslations, TranslationNamespace, AdminTranslations } from '@/lib/translations'
import { getResourcesData } from '@/lib/resources'
import Link from 'next/link'

// 动态导入客户端组件，用于管理资源的交互功能
const ResourcesClientActions = dynamic(() => import('./ResourcesClientActions'), {
  ssr: false,
  loading: () => <div className="p-4">加载资源管理界面...</div>
})

interface ResourcesAdminProps {
  locale: string;
}

export default async function ResourcesAdmin({ locale }: ResourcesAdminProps) {
  // 服务器端获取资源
  const resources = await getResourcesData(locale)
  
  // 获取服务端翻译
  const t = getNamespaceTranslations(locale, 'admin' as TranslationNamespace) as unknown as AdminTranslations

  return (
    <div className="space-y-8">
      <Link 
        href={`/${locale}/admin`}
        className="flex items-center text-primary hover:underline"
      >
        <span className="mr-2">←</span> {t.backToDashboard}
      </Link>
      
      {/* 将服务端获取的资源传递给客户端组件进行管理 */}
      <ResourcesClientActions 
        initialResources={resources} 
        locale={locale} 
      />
    </div>
  )
} 