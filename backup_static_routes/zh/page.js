import fs from 'fs'
import path from 'path'
import { getSortedPostsData } from '@/lib/posts'
import { StaticResourceList } from '@/components/StaticResourceList'
import { StaticArticleList } from '@/components/StaticArticleList'

export const metadata = {
  title: 'GenerateGhibli - 吉卜力风格AI图像生成资源导航',
  description: '发现精选的AI工具、模型和灵感，轻松创建宫崎骏和吉卜力工作室风格的魔幻世界和角色。',
}

export default function HomePage() {
  const resourcesPath = path.join(process.cwd(), 'data', 'json', 'resources.json')
  let resources = []
  try {
    resources = JSON.parse(fs.readFileSync(resourcesPath, 'utf8'))
  } catch (error) {
    console.error('Error loading resources:', error)
  }
  
  const allPostsData = getSortedPostsData().slice(0, 6)
  const locale = 'zh'

  return (
    <div className="container mx-auto py-12 space-y-16">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          GenerateGhibli
        </h1>
        <h2 className="text-2xl tracking-tighter sm:text-3xl md:text-3xl lg:text-3xl">吉卜力风格AI图像生成资源导航</h2>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
          发现精选的AI工具、模型和灵感，轻松创建宫崎骏和吉卜力工作室风格的魔幻世界和角色。
        </p>
      </section>

      <StaticResourceList resources={resources} locale={locale} />
      <StaticArticleList articles={allPostsData} locale={locale} />
    </div>
  )
}
