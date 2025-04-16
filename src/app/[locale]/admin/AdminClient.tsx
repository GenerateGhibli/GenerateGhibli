'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

interface AdminClientProps {
  locale: string;
}

export default function AdminClient({ locale }: AdminClientProps) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const t = useTranslations('admin')

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
  
  if (isLoading) {
    return <div className="container py-8">Loading...</div>
  }
  
  if (!isLoggedIn) {
    return null // Router will redirect
  }
  
  // 导航到子路由的处理函数
  const handleNavigation = (path: string) => {
    try {
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
