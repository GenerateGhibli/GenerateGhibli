import React from 'react'
import { getPostData, getSortedPostsData } from '@/lib/posts'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Script from 'next/script'
import { getNamespaceTranslations, TranslationNamespace } from '@/lib/translations'

// 定义网站基础 URL (可以从环境变量或配置中获取)
const siteUrl = 'https://generateghibli.org';

// 动态生成元数据
export async function generateMetadata({ params }: { params: { id: string, locale: string } }): Promise<Metadata> {
  // 获取翻译文本 (假设使用 'postDetail' 命名空间)
  const t = getNamespaceTranslations(params.locale, 'postDetail' as TranslationNamespace);
  
  try {
    const postData = await getPostData(params.id, params.locale)
    const postUrl = `${siteUrl}/${params.locale}/posts/${params.id}`;
    // 尝试获取封面图片，提供备用图片
    const imageUrl = postData.coverImage ? `${siteUrl}${postData.coverImage}` : `${siteUrl}/og-image.jpg`; // 假设 coverImage 是相对路径

    // 使用翻译文本作为备用描述
    const description = postData.description || t.defaultDescription || '吉卜力风格AI创作灵感和教程'; // 添加 t.defaultDescription

    return {
      title: postData.title,
      description: description, // 使用上面定义的 description
      alternates: {
        canonical: postUrl,
        languages: {
        },
      },
      openGraph: {
        title: postData.title,
        description: description, // 使用上面定义的 description
        url: postUrl,
        type: 'article',
        publishedTime: postData.date,
        authors: ['GenerateGhibli Team'],
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: postData.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: postData.title,
        description: description, // 使用上面定义的 description
        images: [imageUrl],
      },
    }
  } catch {
    // 使用翻译文本作为错误信息
    return {
      title: t.notFoundTitle || '文章未找到', // 使用 t.notFoundTitle
      description: t.notFoundDescription || '抱歉，您请求的文章不存在。' // 使用 t.notFoundDescription
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

  // 构建 JSON-LD 数据
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: postData.title,
    description: postData.description || undefined,
    image: postData.coverImage ? `${siteUrl}${postData.coverImage}` : undefined,
    datePublished: postData.date,
    author: {
      '@type': 'Person',
      name: 'GenerateGhibli Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GenerateGhibli',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/favicon.jpg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/${params.locale}/posts/${params.id}`,
    },
  };

  return (
    <>
      <Script
        id="post-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
    </>
  )
}
