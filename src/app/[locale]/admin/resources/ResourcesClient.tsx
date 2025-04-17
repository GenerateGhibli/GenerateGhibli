'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// import { useTranslations } from 'next-intl'
import React from 'react'

interface ResourcesClientProps {
  locale: string;
}

export default function ResourcesClient({ locale }: ResourcesClientProps) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 使用本地翻译函数而不是useTranslations
  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        dashboard: "Admin Dashboard",
        createPost: "Create Post",
        manageResources: "Manage Resources",
        backToDashboard: "Back to Dashboard"
      },
      zh: {
        dashboard: "管理控制台",
        createPost: "创建文章",
        manageResources: "管理资源",
        backToDashboard: "返回控制台"
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
      } catch (error) {
        console.error('Failed to check auth:', error)
        router.push(`/${locale}/login`)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [router, locale])
  
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
      
      <div className="border rounded-lg p-6 shadow-sm">
        <p className="text-muted-foreground mb-4">
          Resource management functionality will be implemented soon.
        </p>
      </div>
    </div>
  )
}
