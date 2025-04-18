import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getNamespaceTranslations, TranslationNamespace, AdminTranslations } from '@/lib/translations'

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
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  // 使用全局翻译系统
  const t = getNamespaceTranslations(locale as string, 'admin' as TranslationNamespace) as unknown as AdminTranslations

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
  }, [router, locale, fetchResources])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewResource(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveResource = async () => {
    try {
      // 准备更新后的资源数组
      const updatedResources = [...resources]
      
      if (editingIndex !== null) {
        // 更新现有资源
        updatedResources[editingIndex] = newResource
      } else {
        // 添加新资源
        updatedResources.push(newResource)
      }
      
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resources: updatedResources,
          locale: locale
        })
      })
      
      if (response.ok) {
        setNewResource({ name: '', description: '', url: '' })
        setIsEditing(false)
        setEditingIndex(null)
        fetchResources()
      }
    } catch (error) {
      console.error('保存资源失败:', error)
    }
  }
  
  const handleEditResource = (index: number) => {
    setNewResource(resources[index])
    setEditingIndex(index)
    setIsEditing(true)
  }
  
  const handleDeleteResource = async (index: number) => {
    if (confirm(t.confirmDelete)) {
      try {
        const updatedResources = [...resources]
        updatedResources.splice(index, 1)
        
        const response = await fetch('/api/resources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resources: updatedResources,
            locale: locale
          })
        })
        
        if (response.ok) {
          fetchResources()
        }
      } catch (error) {
        console.error('删除资源失败:', error)
      }
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
    return <div className="container py-8">{t.loading}</div>
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
        <span className="mr-2">←</span> {t.backToDashboard}
      </button>
      
      <h1 className="text-3xl font-bold mb-6">{t.manageResources}</h1>
      
      <div className="border rounded-lg p-6 shadow-sm mb-8">
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="mb-4">
            {t.addResource}
          </Button>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">
              {editingIndex !== null ? t.editResource : t.addResource}
            </h3>
            <Input
              name="name"
              value={newResource.name}
              onChange={handleInputChange}
              placeholder={t.resourceName}
              required
            />
            <Input
              name="url"
              value={newResource.url}
              onChange={handleInputChange}
              placeholder={t.resourceUrl}
              required
            />
            <Textarea
              name="description"
              value={newResource.description}
              onChange={handleInputChange}
              placeholder={t.resourceDesc}
              rows={3}
              required
            />
            <div className="flex gap-2">
              <Button onClick={handleSaveResource}>
                {editingIndex !== null ? t.update : t.save}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false)
                  setEditingIndex(null)
                  setNewResource({ name: '', description: '', url: '' })
                }}
              >
                {t.cancel}
              </Button>
            </div>
          </div>
        )}
      </div>

      {resources.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t.resourcesList}</h2>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource, index) => (
              <div key={index} className="border rounded-lg p-4 shadow-sm">
                <h3 className="font-bold text-lg mb-2">{resource.name}</h3>
                <p className="text-muted-foreground mb-2">{resource.description}</p>
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm inline-block mb-4"
                >
                  {resource.url}
                </a>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleEditResource(index)}
                  >
                    {t.edit}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleDeleteResource(index)}
                  >
                    {t.delete}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
