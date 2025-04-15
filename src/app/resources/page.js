import fs from 'fs'
import path from 'path'
import { Metadata } from 'next'
import ResourceList from '@/components/ResourceList'
import { StaticNavigation } from '@/components/StaticNavigation'
import { StaticFooter } from '@/components/StaticFooter'
import { defaultLocale } from '@/i18n/index'

export const metadata = {
  title: 'Resources - GitBase',
  description: 'Explore useful resources for GitBase and web development.',
}

export default function Resources() {
  const resourcesPath = path.join(process.cwd(), 'data', 'json', 'resources.json')
  let resources = []
  try {
    resources = JSON.parse(fs.readFileSync(resourcesPath, 'utf8'))
  } catch (error) {
    console.error('Error loading resources:', error)
  }
  
  // 使用默认语言
  const locale = defaultLocale

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <StaticNavigation locale={locale} />
      <div className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold">Resources</h1>
          <p className="text-gray-500 mt-2">Explore useful resources for GitBase and web development.</p>
        </div>
        <ResourceList resources={resources} />
      </div>
      <StaticFooter locale={locale} />
    </div>
  )
}
