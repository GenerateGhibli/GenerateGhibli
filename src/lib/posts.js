import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

// 静态导入文章内容
import totoroContent from '../../data/md/totoro-character-creation.md?raw'
import ghibliStyleContent from '../../data/md/ghibli-style-ai-art-guide.md?raw'
import ghibliMemeContent from '../../data/md/ghibli-meme-art-guide.md?raw'

// 预定义的文章列表
const POSTS = [
  {
    id: 'totoro-character-creation',
    fileContent: totoroContent,
  },
  {
    id: 'ghibli-style-ai-art-guide',
    fileContent: ghibliStyleContent,
  },
  {
    id: 'ghibli-meme-art-guide',
    fileContent: ghibliMemeContent,
  }
]

// 替代文件系统的函数
export function getSortedPostsData() {
  const allPostsData = POSTS.map(({ id, fileContent }) => {
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

export async function getPostData(slug) {
  // 查找对应ID的文章
  const post = POSTS.find(post => post.id === slug)
  
  if (!post) {
    throw new Error(`Post with slug "${slug}" not found`)
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
  }
}

export async function getPostData2(id) {
  // 复用相同的逻辑
  return getPostData(id)
}