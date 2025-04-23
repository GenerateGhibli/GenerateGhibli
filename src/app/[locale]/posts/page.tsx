import React from 'react';
import { getSortedPostsData } from '@/lib/posts'
import { StaticArticleList } from '@/components/StaticArticleList'
import { Metadata } from 'next'
import { getNamespaceTranslations, TranslationNamespace } from '@/lib/translations'

// 定义网站基础 URL (可以从环境变量或配置中获取)
const siteUrl = 'https://generateghibli.org';

// 动态生成元数据
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  // 获取 posts 命名空间的翻译
  const t = getNamespaceTranslations(params.locale, 'posts' as TranslationNamespace); // 假设翻译在 'posts' 命名空间下

  const title = t.metaTitle || t.title || '文章列表'; // 优先用 metaTitle, 其次是 title, 最后备用
  const description = t.metaDescription || t.description || '浏览所有吉卜力风格创作文章和教程。'; // 优先用 metaDescription, 其次是 description, 最后备用
  const keywords = t.metaKeywords || []; // 假设翻译文件中有 metaKeywords 数组
  const pageUrl = `${siteUrl}/${params.locale}/posts`;
  const ogImageUrl = `${siteUrl}/og-posts.jpg`; // 假设列表页有特定的 OG 图片

  return {
    title: title, // 使用本地化标题
    description: description, // 使用本地化描述
    keywords: keywords, // 使用本地化关键词
    alternates: {
      canonical: pageUrl, // 列表页的规范 URL
      languages: {
        // 'en': `${siteUrl}/en/posts`,
        // 'zh': `${siteUrl}/zh/posts`,
      },
    },
    openGraph: {
      title: title,
      description: description,
      url: pageUrl,
      type: 'website', // 列表页通常是 website 类型
      images: [
        {
          url: ogImageUrl, // 列表页 OG 图片
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [ogImageUrl],
    },
  };
}

export default function Posts({ params }: { params: { locale: string } }) {
  // 向 getSortedPostsData 传递 locale 参数
  const allPostsData = getSortedPostsData(params.locale)
  
  // 获取本地化文本 (可以从 generateMetadata 复用逻辑，或者保持现有方式)
  const t = getNamespaceTranslations(params.locale, 'posts' as TranslationNamespace);
  const pageTitle = t.title || '吉卜力风格创作文章';
  const pageDescription = t.description || '探索吉卜力风格AI艺术创作的文章、教程和技巧...';

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold ghibli-title">{pageTitle}</h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">{pageDescription}</p>
      </div>
      <StaticArticleList articles={allPostsData} locale={params.locale} />
    </div>
  )
}
