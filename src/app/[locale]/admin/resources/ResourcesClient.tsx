'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// import { useTranslations } from 'next-intl'
import React from 'react'
import ResourceList from '@/components/ResourceList'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface ResourcesClientProps {
  locale: string;
}

interface Resource {
  name: string;
  description: string;
  url: string;
}

export default function ResourcesClient({ locale }: ResourcesClientProps) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [resources, setResources] = useState<Resource[]>([])
  const [newResource, setNewResource] = useState<Resource>({ name: '', description: '', url: '' })
  const [isEditing, setIsEditing] = useState(false)

  // 使用本地翻译函数而不是useTranslations
  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        dashboard: "Admin Dashboard",
        createPost: "Create Post",
        manageResources: "Manage Resources",
        backToDashboard: "Back to Dashboard",
        addResource: "Add New Resource",
        resourceName: "Resource Name",
        resourceDesc: "Resource Description",
        resourceUrl: "Resource URL",
        save: "Save",
        cancel: "Cancel"
      },
      zh: {
        dashboard: "管理控制台",
        createPost: "创建文章",
        manageResources: "管理资源",
        backToDashboard: "返回控制台",
        addResource: "添加新资源",
        resourceName: "资源名称",
        resourceDesc: "资源描述",
        resourceUrl: "资源链接",
        save: "保存",
        cancel: "取消"
      }
    }
    return (translations[locale] && translations[locale][key]) || key
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/check-auth')
        const data = await response.json()
        
        if (!data.isLoggedIn) {
          router.push(`/${locale}/login`)
          return
        }
        
        setIsLoggedIn(true)
        fetchResources()
      } catch (error) {
        console.error('Failed to check auth:', error)
        router.push(`/${locale}/login`)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [router, locale])

  const fetchResources = async () => {
    try {
      const response = await fetch(`/api/resources?locale=${locale}`)
      if (response.ok) {
        const data = await response.json()
        setResources(data)
      }
    } catch (error) {
      console.error('加载资源失败:', error)
    }
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewResource(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveResource = async () => {
    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resources: newResource,
          locale: locale
        })
      })
      
      if (response.ok) {
        setNewResource({ name: '', description: '', url: '' })
        setIsEditing(false)
        fetchResources()
      }
    } catch (error) {
      console.error('保存资源失败:', error)
    }
  }
  
  // 处理导航
  const handleNavigation = (path: string) => {
    try {
      router.push(path)
    } catch (error) {
      console.error(`导航到 ${path} 失败:`, error)
      // 如果导航失败，可以尝试备用方案
      window.location.href = path
    }
  }
  
  if (isLoading) {
    return <div className="container py-8">Loading...</div>
  }
  
  if (!isLoggedIn) {
    return null // Router will redirect
  }
  
  return (
    <div className="container py-8">
      <button 
        onClick={() => handleNavigation(`/${locale}/admin`)}
        className="mb-6 flex items-center text-primary hover:underline"
      >
        <span className="mr-2">←</span> {t('backToDashboard')}
      </button>
      
      <h1 className="text-3xl font-bold mb-6">{t('manageResources')}</h1>
      
      <div className="border rounded-lg p-6 shadow-sm mb-8">
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="mb-4">
            {t('addResource')}
          </Button>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{t('addResource')}</h3>
            <Input
              name="name"
              value={newResource.name}
              onChange={handleInputChange}
              placeholder={t('resourceName')}
            />
            <Input
              name="url"
              value={newResource.url}
              onChange={handleInputChange}
              placeholder={t('resourceUrl')}
            />
            <Textarea
              name="description"
              value={newResource.description}
              onChange={handleInputChange}
              placeholder={t('resourceDesc')}
              rows={3}
            />
            <div className="flex gap-2">
              <Button onClick={handleSaveResource}>{t('save')}</Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false)
                  setNewResource({ name: '', description: '', url: '' })
                }}
              >
                {t('cancel')}
              </Button>
            </div>
          </div>
        )}
      </div>

      {resources.length > 0 && (
        <ResourceList resources={resources} showMoreLink={false} />
      )}
    </div>
  )
}
