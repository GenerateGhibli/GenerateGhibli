'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

interface CreatePostClientProps {
  locale: string;
}

export default function CreatePostClient({ locale }: CreatePostClientProps) {
  const router = useRouter()
  const t = useTranslations('admin')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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
      
      <h1 className="text-3xl font-bold mb-6">{t('createPost')}</h1>
      
      <div className="border rounded-lg p-6 shadow-sm">
        <p className="text-muted-foreground mb-4">
          Create post functionality will be implemented soon.
        </p>
      </div>
    </div>
  )
}
