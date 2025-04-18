import React from 'react'
import { getPostData, getSortedPostsData } from '@/lib/posts'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

// 动态生成元数据
export async function generateMetadata({ params }: { params: { id: string, locale: string } }): Promise<Metadata> {
  try {
    const postData = await getPostData(params.id, params.locale)
    return {
      title: `${postData.title} | GenerateGhibli`,
      description: postData.description || '吉卜力风格AI创作灵感和教程',
      openGraph: {
        title: postData.title,
        description: postData.description || '吉卜力风格AI创作灵感和教程',
        type: 'article',
        publishedTime: postData.date,
      }
    }
  } catch {
    return {
      title: '文章未找到 | GenerateGhibli',
      description: '抱歉，您请求的文章不存在。'
    }
  }
}

// 定义文章类型接口
interface Article {
  id: string;
  title: string;
  description: string;
  date: string;
  coverImage?: string;
}

// 生成静态路径
export async function generateStaticParams() {
  const posts = getSortedPostsData() as Article[]
  return posts.map((post: Article) => ({
    id: post.id,
  }))
}

export default async function Post({ params }: { params: { id: string, locale: string } }) {
  let postData;
  
  try {
    postData = await getPostData(params.id, params.locale)
  } catch {
    notFound()
  }
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
    return date.toLocaleDateString(params.locale === 'zh' ? 'zh-CN' : 'en-US', options)
  }

  return (
    <div className="container mx-auto py-12">
      <article className="prose prose-lg dark:prose-invert mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4 ghibli-title">{postData.title}</h1>
          <div className="text-muted-foreground">
            {formatDate(postData.date)}
          </div>
        </header>
        
        {postData.description && (
          <div className="bg-secondary/20 p-6 rounded-lg mb-8">
            <p className="text-lg italic text-muted-foreground">{postData.description}</p>
          </div>
        )}
        
        <div 
          className="mt-8 ghibli-content"
          dangerouslySetInnerHTML={{ __html: postData.contentHtml }} 
        />
      </article>
    </div>
  )
}
