import { MetadataRoute } from 'next'
import { locales } from '@/i18n' // 移除 defaultLocale
import { getSortedPostsData } from '@/lib/posts' // 导入获取文章数据的函数

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://generateghibli.org'; // 从环境变量获取或使用默认值

// 定义文章类型（确保与 getSortedPostsData 返回的类型一致）
interface Post {
  id: string;
  date: string;
  title: string;
  description: string;
  coverImage: string;
}

// 定义合法的 changeFrequency 类型
type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export default function sitemap(): MetadataRoute.Sitemap {
  // 1. 静态页面 (首页, 文章列表, 资源列表等)
  const staticPages = ['/', '/posts', '/resources']; // 根据您的实际页面添加
  const staticUrls = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${siteUrl}/${locale}${page === '/' ? '' : page}`,
      lastModified: new Date().toISOString().split('T')[0], // 使用ISO格式的日期部分
      changeFrequency: (page === '/' ? 'daily' : 'weekly') as ChangeFrequency,
      priority: page === '/' ? 1 : 0.8,
    }))
  );

  // 2. 动态页面 (文章详情页)
  // 为每种语言分别获取文章数据
  const postUrls = locales.flatMap((locale) => {
    const localePosts = getSortedPostsData(locale) as Post[];
    return localePosts.map((post: Post) => ({
      url: `${siteUrl}/${locale}/posts/${post.id}`,
      lastModified: new Date(post.date).toISOString().split('T')[0], // 使用ISO格式的日期部分
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.6,
    }));
  });

  // 3. (可选) 其他动态页面 (例如，资源详情页)
  // const resourceUrls = ...

  return [
    ...staticUrls,
    ...postUrls,
    // ...resourceUrls,
  ];
} 