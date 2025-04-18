import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getResourcesData } from '@/lib/resources'
import { getNamespaceTranslations, TranslationNamespace, ResourcesTranslations } from '@/lib/translations'
import { Metadata } from 'next'

// 定义资源类型
interface Resource {
  name: string;
  description: string;
  url: string;
  category?: string;
  icon?: string;
}

// 定义页面参数类型
interface ResourcesPageProps {
  params: {
    locale: string;
  }
}

// 生成元数据
export async function generateMetadata({ params }: ResourcesPageProps): Promise<Metadata> {
  const { locale } = params
  const t = getNamespaceTranslations(locale, 'resources' as TranslationNamespace) as unknown as ResourcesTranslations

  return {
    title: t.title,
    description: t.description,
  }
}

// 服务器端渲染的资源页面
export default async function ResourcesPage({ params }: ResourcesPageProps) {
  const { locale } = params
  
  // 获取服务器端翻译
  const t = getNamespaceTranslations(locale, 'resources' as TranslationNamespace) as unknown as ResourcesTranslations
  
  // 获取资源数据
  const resources = await getResourcesData(locale) as Resource[]
  
  // 对资源进行分类
  const resourcesByCategory = resources.reduce((acc: {[key: string]: Resource[]}, resource: Resource) => {
    const category = resource.category || 'other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(resource)
    return acc
  }, {})
  
  // 获取所有分类
  const categories = Object.keys(resourcesByCategory)

  return (
    <main className="min-h-screen py-12">
      <div className="container">
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
          <p className="text-xl text-muted-foreground">{t.description}</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-6">{t.categories}</h2>
          
          <div className="space-y-12">
            {categories.map((category) => (
              <div key={category} className="space-y-4">
                <h3 className="text-xl font-semibold capitalize">{t[category as keyof ResourcesTranslations] || category}</h3>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {resourcesByCategory[category].map((resource: Resource, index: number) => (
                    <div 
                      key={index}
                      className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center mb-3">
                        {resource.icon ? (
                          <div className="w-8 h-8 mr-3 relative overflow-hidden rounded-full bg-gray-100">
                            <Image 
                              src={resource.icon} 
                              alt={`${resource.name} icon`}
                              width={32}
                              height={32}
                              className="object-contain"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 mr-3 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary text-xs">{resource.name.substring(0, 2)}</span>
                          </div>
                        )}
                        <h4 className="font-bold text-lg">{resource.name}</h4>
                      </div>
                      <p className="text-muted-foreground mb-4">{resource.description}</p>
                      <Link
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 bg-primary/10 px-4 py-2 rounded-md inline-flex items-center gap-2 transition-colors"
                      >
                        <span>访问资源</span>
                        <span>→</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
