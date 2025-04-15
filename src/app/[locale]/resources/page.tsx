import fs from 'fs'
import path from 'path'
import { Metadata } from 'next'
import ResourceList from '@/components/ResourceList'

export const metadata: Metadata = {
  title: 'Resources - GitBase',
  description: 'Explore useful resources for GitBase and web development.',
}

export default function Resources({ params }: { params: { locale: string } }) {
  const resourcesPath = path.join(process.cwd(), 'data', 'json', 'resources.json')
  let resources = []
  try {
    resources = JSON.parse(fs.readFileSync(resourcesPath, 'utf8'))
  } catch (error) {
    console.error('Error loading resources:', error)
  }
  
  // 根据当前语言选择文本
  const getText = () => {
    if (params.locale === 'zh') {
      return {
        title: '资源',
        description: '探索GitBase和Web开发的有用资源。'
      }
    }
    return {
      title: 'Resources',
      description: 'Explore useful resources for GitBase and web development.'
    }
  }
  
  const text = getText()

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold">{text.title}</h1>
        <p className="text-gray-500 mt-2">{text.description}</p>
      </div>
      <ResourceList resources={resources} />
    </div>
  )
}
