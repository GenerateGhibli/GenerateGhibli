/**
 * 通用元数据配置 - 支持中英文
 */
export const metadataTranslations = {
  en: {
    title: 'GenerateGhibli - Studio Ghibli Style AI Art Generator',
    description: 'Explore a complete resource library for Studio Ghibli style AI image generation. Discover the best AI tools, models and inspiration to create magical worlds and characters in the style of Hayao Miyazaki and Studio Ghibli. Generate Ghibli style images online for free.',
    keywords: 'Ghibli style, AI image generation, Hayao Miyazaki, Studio Ghibli, AI art, artificial intelligence painting, Ghibli AI, anime style, AI drawing tools, Ghibli art style',
    openGraph: {
      title: 'GenerateGhibli - Studio Ghibli Style AI Art Generator Resources',
      description: 'Explore a complete resource library for Studio Ghibli style AI image generation. Discover the best AI tools, models and inspiration to create magical worlds and characters in the style of Hayao Miyazaki and Studio Ghibli.',
      images: [{
        url: 'https://toimg.xyz/file/5aa892c8e8385232fcdf3.png',
        width: 1200,
        height: 630,
        alt: 'GenerateGhibli - Studio Ghibli Style AI Art Generator Resources',
      }],
      locale: 'en_US',
    },
    twitter: {
      title: 'GenerateGhibli - Studio Ghibli Style AI Art Generator Resources',
      description: 'Explore a complete resource library for Studio Ghibli style AI image generation. Discover the best AI tools, models and inspiration to create magical worlds and characters in the style of Hayao Miyazaki and Studio Ghibli.',
    }
  },
  zh: {
    title: 'GenerateGhibli - 吉卜力风格AI图像生成资源导航',
    description: '探索吉卜力风格AI图像生成的完整资源库。收集最佳AI工具、模型和灵感，轻松创建宫崎骏和吉卜力工作室风格的魔幻世界和角色。免费在线生成吉卜力风格图片。',
    keywords: '吉卜力风格, AI图像生成, 宫崎骏, Studio Ghibli, AI艺术, 人工智能绘画, 吉卜力AI, 动漫风格, AI绘画工具, 吉卜力画风',
    openGraph: {
      title: 'GenerateGhibli - 吉卜力风格AI图像生成资源导航',
      description: '探索吉卜力风格AI图像生成的完整资源库。收集最佳AI工具、模型和灵感，轻松创建宫崎骏和吉卜力工作室风格的魔幻世界和角色。',
      images: [{
        url: 'https://toimg.xyz/file/5aa892c8e8385232fcdf3.png',
        width: 1200,
        height: 630,
        alt: 'GenerateGhibli - 吉卜力风格AI图像生成资源导航',
      }],
      locale: 'zh_CN',
    },
    twitter: {
      title: 'GenerateGhibli - 吉卜力风格AI图像生成资源导航',
      description: '探索吉卜力风格AI图像生成的完整资源库。收集最佳AI工具、模型和灵感，轻松创建宫崎骏和吉卜力工作室风格的魔幻世界和角色。',
    }
  }
}

/**
 * 创建页面元数据
 * @param {Object} options - 选项
 * @param {string} options.locale - 语言
 * @param {Object} [options.extraMetadata] - 额外元数据（可选）
 * @returns {Object} 元数据对象
 */
export function generateMetadata({ locale = 'en', extraMetadata = {} }) {
  const baseMetadata = metadataTranslations[locale] || metadataTranslations.en
  
  const metadata = {
    title: extraMetadata.title || baseMetadata.title,
    description: extraMetadata.description || baseMetadata.description,
    keywords: extraMetadata.keywords || baseMetadata.keywords,
    openGraph: {
      ...baseMetadata.openGraph,
      ...(extraMetadata.openGraph || {}),
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      alternateLocales: locale === 'zh' ? ['en_US'] : ['zh_CN'],
    },
    twitter: {
      ...baseMetadata.twitter,
      ...(extraMetadata.twitter || {}),
      card: 'summary_large_image',
      images: extraMetadata.twitter?.images || baseMetadata.openGraph.images.map(img => img.url),
    },
    alternates: {
      canonical: `https://generateghibli.org/${locale}`,
      languages: {
        'en': 'https://generateghibli.org/en',
        'zh': 'https://generateghibli.org/zh',
      },
    },
  }
  
  return metadata
} 