'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// import { useTranslations } from 'next-intl'
import React from 'react'
import ArticleEditor from '@/components/ArticleEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface CreatePostClientProps {
  locale: string;
}

export default function CreatePostClient({ locale }: CreatePostClientProps) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [articleData, setArticleData] = useState({ title: '', description: '', content: '', path: '' })
  const [isEditing, setIsEditing] = useState(false)

  // 使用本地翻译函数而不是useTranslations
  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        dashboard: "Admin Dashboard",
        createPost: "Create Post",
        manageResources: "Manage Resources",
        backToDashboard: "Back to Dashboard",
        title: "Article Title",
        description: "Article Description",
        content: "Article Content",
        path: "Article Path (URL)",
        save: "Save Article",
        continue: "Continue to Editor"
      },
      zh: {
        dashboard: "管理控制台",
        createPost: "创建文章",
        manageResources: "管理资源",
        backToDashboard: "返回控制台",
        title: "文章标题",
        description: "文章描述",
        content: "文章内容",
        path: "文章路径(URL)",
        save: "保存文章",
        continue: "继续编辑"
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
  
  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setArticleData(prev => ({ ...prev, [name]: value }))
  }

  // 处理保存路径并进入编辑
  const handleContinueToEditor = async () => {
    if (!articleData.path) {
      alert('请设置文章路径')
      return
    }
    
    try {
      // 可以在这里预先创建文章
      await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article: articleData }),
      })
      
      // 设置编辑状态为true
      setIsEditing(true)
    } catch (error) {
      console.error('创建文章失败:', error)
      alert('创建文章失败，请重试')
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

  // 如果已经进入编辑模式，显示ArticleEditor
  if (isEditing) {
    // 将路径添加到window.location.search中以便ArticleEditor可以读取
    if (typeof window !== 'undefined' && !window.location.search.includes('path=')) {
      router.push(`?path=${encodeURIComponent(articleData.path)}`)
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
          <ArticleEditor />
        </div>
      </div>
    )
  }
  
  // 否则显示创建文章表单
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
        <div className="space-y-4">
          <Input
            name="title"
            value={articleData.title}
            onChange={handleInputChange}
            placeholder={t('title')}
          />
          <Input
            name="description"
            value={articleData.description}
            onChange={handleInputChange}
            placeholder={t('description')}
          />
          <Input
            name="path"
            value={articleData.path}
            onChange={handleInputChange}
            placeholder={t('path')}
            required
          />
          <Textarea
            name="content"
            value={articleData.content}
            onChange={handleInputChange}
            placeholder={t('content')}
            rows={10}
          />
          <Button onClick={handleContinueToEditor}>{t('continue')}</Button>
        </div>
      </div>
    </div>
  )
}
