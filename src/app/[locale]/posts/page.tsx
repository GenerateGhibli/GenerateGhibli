import { getSortedPostsData } from '@/lib/posts'
import ArticleList from '@/components/ArticleList'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Posts - GitBase',
  description: 'Read the latest articles and tutorials about GitBase and web development.',
}

export default function Posts({ params }: { params: { locale: string } }) {
  const allPostsData = getSortedPostsData()
  
  // 根据当前语言选择文本
  const getText = () => {
    if (params.locale === 'zh') {
      return {
        title: '文章',
        description: '阅读关于GitBase和Web开发的最新文章和教程。'
      }
    }
    return {
      title: 'Posts',
      description: 'Read the latest articles and tutorials about GitBase and web development.'
    }
  }
  
  const text = getText()

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold">{text.title}</h1>
        <p className="text-gray-500 mt-2">{text.description}</p>
      </div>
      <ArticleList articles={allPostsData} />
    </div>
  )
}
