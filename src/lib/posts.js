import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

// 定义支持的语言
const SUPPORTED_LOCALES = ['en', 'zh']
const DEFAULT_LOCALE = 'en'

// 中文内容导入
import zhTotoroContent from '../../data/locales/zh/md/totoro-character-creation.md?raw'
import zhGhibliStyleContent from '../../data/locales/zh/md/ghibli-style-ai-art-guide.md?raw'
import zhGhibliMemeContent from '../../data/locales/zh/md/ghibli-meme-art-guide.md?raw'

// 英文内容导入
import enTotoroContent from '../../data/locales/en/md/totoro-character-creation.md?raw'
import enGhibliStyleContent from '../../data/locales/en/md/ghibli-style-ai-art-guide.md?raw'
import enGhibliMemeContent from '../../data/locales/en/md/ghibli-meme-art-guide.md?raw'

// 预定义的文章映射表（按语言组织）
const POSTS = {
  zh: [
    {
      id: 'totoro-character-creation',
      fileContent: zhTotoroContent,
    },
    {
      id: 'ghibli-style-ai-art-guide',
      fileContent: zhGhibliStyleContent,
    },
    {
      id: 'ghibli-meme-art-guide',
      fileContent: zhGhibliMemeContent,
    }
  ],
  en: [
    {
      id: 'totoro-character-creation',
      fileContent: enTotoroContent,
    },
    {
      id: 'ghibli-style-ai-art-guide',
      fileContent: enGhibliStyleContent,
    },
    {
      id: 'ghibli-meme-art-guide',
      fileContent: enGhibliMemeContent,
    }
  ]
}

// 获取指定语言的文章列表
export function getSortedPostsData(locale = DEFAULT_LOCALE) {
  // 确保使用有效的语言
  const validLocale = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE
  
  // 获取对应语言的文章列表
  const allPostsData = POSTS[validLocale].map(({ id, fileContent }) => {
    // 使用gray-matter解析文章元数据
    const matterResult = matter(fileContent)

    // 组合数据
    return {
      id,
      title: matterResult.data.title,
      description: matterResult.data.description,
      date: matterResult.data.date,
      coverImage: matterResult.data.coverImage,
    }
  })
  
  // 按日期排序
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export async function getPostData(slug, locale = DEFAULT_LOCALE) {
  // 确保使用有效的语言
  const validLocale = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE
  
  // 查找对应ID和语言的文章
  const post = POSTS[validLocale].find(post => post.id === slug)
  
  if (!post) {
    throw new Error(`Post with slug "${slug}" not found for locale "${validLocale}"`)
  }
  
  // 使用gray-matter解析文章元数据
  const matterResult = matter(post.fileContent)

  // 使用remark将markdown转换为HTML
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  // 组合数据
  return {
    slug,
    contentHtml,
    title: matterResult.data.title,
    description: matterResult.data.description,
    date: matterResult.data.date,
    coverImage: matterResult.data.coverImage,
    locale: validLocale, // 新增语言信息
  }
}

export async function getPostData2(id, locale = DEFAULT_LOCALE) {
  // 复用相同的逻辑
  return getPostData(id, locale)
}