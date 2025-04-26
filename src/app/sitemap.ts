import { MetadataRoute } from 'next'
import { locales } from '@/i18n' // 移除 defaultLocale
import { getSortedPostsData } from '@/lib/posts' // 导入获取文章数据的函数

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://generateghibli.org'; // 从环境变量获取或使用默认值

// 定义文章类型（确保与 getSortedPostsData 返回的类型一致）
interface Post {
  id: string;
  date: string; // 或者 lastModified date
  // 其他可能需要的字段，例如 locale (如果 getSortedPostsData 返回所有语言)
}

// 定义合法的 changeFrequency 类型
type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export default function sitemap(): MetadataRoute.Sitemap {
  // 1. 静态页面 (首页, 文章列表, 资源列表等)
  const staticPages = ['/', '/posts', '/resources']; // 根据您的实际页面添加
  const staticUrls = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${siteUrl}/${locale}${page === '/' ? '' : page}`,
      lastModified: new Date(), // 可以用更精确的日期
      changeFrequency: (page === '/' ? 'daily' : 'weekly') as ChangeFrequency,
      priority: page === '/' ? 1 : 0.8, // 示例优先级
    }))
  );

  // 2. 动态页面 (文章详情页)
  // 注意：假设 getSortedPostsData() 返回所有语言的文章，且每个文章对象有 id 和 date 属性
  // 如果 getSortedPostsData 需要 locale 参数，您需要为每种语言调用它
  const allPosts = getSortedPostsData() as Post[]; // 获取所有文章数据
  const postUrls = locales.flatMap((locale) =>
    allPosts.map((post) => ({
        // 这里假设文章ID在不同语言间是相同的，且路由结构是 /[locale]/posts/[id]
        // 如果您的文章在不同语言有不同的ID或slug，需要调整逻辑
        url: `${siteUrl}/${locale}/posts/${post.id}`,
        lastModified: new Date(post.date), // 使用文章的日期
        changeFrequency: 'monthly' as ChangeFrequency,
        priority: 0.6,
      }))
    );


  // 3. (可选) 其他动态页面 (例如，资源详情页)
  // const resourceUrls = ...

  return [
    ...staticUrls,
    ...postUrls,
    // ...resourceUrls,
  ];
} 