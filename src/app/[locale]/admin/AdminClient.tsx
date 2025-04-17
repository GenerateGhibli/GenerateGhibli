'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
// import { useTranslations } from 'next-intl'
import React from 'react'

interface AdminClientProps {
  locale: string;
}

export default function AdminClient({ locale }: AdminClientProps) {
  console.log("AdminClient rendering:", { locale })
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
    console.log("AdminClient useEffect running")
    const checkAuth = async () => {
      try {
        console.log("Checking authentication...")
        const response = await fetch('/api/check-auth', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // 添加凭证参数确保cookie被发送
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error('Failed to check authentication')
        }
        
        const data = await response.json()
        console.log("Auth check response:", data)
        
        if (!data.isLoggedIn) {
          console.log("Not logged in, redirecting to login page")
          router.push(`/${locale}/login`)
          return
        }
        
        console.log("User is logged in, showing admin page")
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
  
  if (isLoading) {
    return <div className="container py-8">Loading...</div>
  }
  
  if (!isLoggedIn) {
    return <div className="container py-8">Redirecting to login page...</div>
  }
  
  // 导航到子路由的处理函数
  const handleNavigation = (path: string) => {
    try {
      console.log(`Navigating to /${locale}/admin/${path}`)
      router.push(`/${locale}/admin/${path}`)
    } catch (error) {
      console.error(`导航到 ${path} 失败:`, error)
      // 如果导航失败，可以尝试备用方案
      window.location.href = `/${locale}/admin/${path}`
    }
  }
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">{t('dashboard')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">{t('createPost')}</h2>
          <p className="text-muted-foreground mb-4">Create a new article for your website.</p>
          <button 
            onClick={() => handleNavigation('create-post')}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
          >
            {t('createPost')}
          </button>
        </div>
        
        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">{t('manageResources')}</h2>
          <p className="text-muted-foreground mb-4">Manage your website resources.</p>
          <button 
            onClick={() => handleNavigation('resources')}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
          >
            {t('manageResources')}
          </button>
        </div>
      </div>
    </div>
  )
}
