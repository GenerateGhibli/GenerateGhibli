import React from 'react'
import { getNamespaceTranslations, TranslationNamespace, AdminTranslations } from '@/lib/translations'
import ResourcesAdmin from './ResourcesAdmin'
import { Metadata } from 'next'

interface ResourcesPageProps {
  params: {
    locale: string;
  }
}

export const metadata: Metadata = {
  title: 'Manage Resources | GenerateGhibli',
  description: '管理网站资源',
};

export default async function ResourcesPage({ params }: ResourcesPageProps) {
  const { locale } = params

  // 获取服务端翻译
  const t = getNamespaceTranslations(locale, 'admin' as TranslationNamespace) as unknown as AdminTranslations

  return (
    <main className="min-h-screen py-12">
      <div className="container">
        <h1 className="text-3xl font-bold mb-6">{t.manageResources}</h1>
        <ResourcesAdmin locale={locale} />
      </div>
    </main>
  )
}
