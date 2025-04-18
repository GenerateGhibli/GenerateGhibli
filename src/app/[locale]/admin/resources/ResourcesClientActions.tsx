'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getNamespaceTranslations, TranslationNamespace, AdminTranslations } from '@/lib/translations'

interface Resource {
  name: string;
  description: string;
  url: string;
  icon?: string;
  category?: string;
}

interface ResourcesClientActionsProps {
  initialResources: Resource[];
  locale: string;
}

export default function ResourcesClientActions({ initialResources, locale }: ResourcesClientActionsProps) {
  const [resources, setResources] = useState<Resource[]>(initialResources)
  const [newResource, setNewResource] = useState<Resource>({ name: '', description: '', url: '' })
  const [isEditing, setIsEditing] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  // 使用全局翻译系统
  const t = getNamespaceTranslations(locale as string, 'admin' as TranslationNamespace) as unknown as AdminTranslations

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
        setResources(updatedResources)
        setNewResource({ name: '', description: '', url: '' })
        setIsEditing(false)
        setEditingIndex(null)
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
          setResources(updatedResources)
        }
      } catch (error) {
        console.error('删除资源失败:', error)
      }
    }
  }
  
  return (
    <div>
      <div className="border rounded-lg p-6 shadow-sm mb-8">
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="mb-4 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
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
            <Input
              name="icon"
              value={newResource.icon || ''}
              onChange={handleInputChange}
              placeholder="图标URL (选填)"
            />
            <Input
              name="category"
              value={newResource.category || ''}
              onChange={handleInputChange}
              placeholder="分类 (tools, models, inspiration 等)"
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
              <Button onClick={handleSaveResource} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                {editingIndex !== null ? t.update : t.save}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false)
                  setEditingIndex(null)
                  setNewResource({ name: '', description: '', url: '' })
                }}
                className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
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
                  <h3 className="font-bold text-lg">{resource.name}</h3>
                </div>
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
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                      <path d="m15 5 4 4"/>
                    </svg>
                    {t.edit}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleDeleteResource(index)}
                    className="flex items-center gap-1.5 px-3 py-1.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"/>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      <line x1="10" x2="10" y1="11" y2="17"/>
                      <line x1="14" x2="14" y1="11" y2="17"/>
                    </svg>
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