// 定义支持的语言
const SUPPORTED_LOCALES = ['en', 'zh']
const DEFAULT_LOCALE = 'en'

// 导入资源数据
import zhResources from '../../data/locales/zh/json/resources.json'
import enResources from '../../data/locales/en/json/resources.json'

// 导入文章索引数据
import zhArticles from '../../data/locales/zh/json/articles.json'
import enArticles from '../../data/locales/en/json/articles.json'

// 资源数据映射
const RESOURCES = {
  zh: zhResources,
  en: enResources
}

// 文章索引数据映射
const ARTICLES = {
  zh: zhArticles,
  en: enArticles
}

/**
 * 获取指定语言的资源数据
 * @param {string} locale - 语言代码
 * @returns {Array} 资源数据列表
 */
export function getResourcesData(locale = DEFAULT_LOCALE) {
  // 确保使用有效的语言
  const validLocale = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE
  
  // 返回对应语言的资源数据
  return RESOURCES[validLocale]
}

/**
 * 获取指定语言的文章索引数据
 * @param {string} locale - 语言代码
 * @returns {Array} 文章索引数据列表
 */
export function getArticlesData(locale = DEFAULT_LOCALE) {
  // 确保使用有效的语言
  const validLocale = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE
  
  // 返回对应语言的文章索引数据
  return ARTICLES[validLocale]
}

/**
 * 按类别筛选资源
 * @param {string} category - 资源类别
 * @param {string} locale - 语言代码
 * @returns {Array} 筛选后的资源列表
 */
export function getResourcesByCategory(category, locale = DEFAULT_LOCALE) {
  const resources = getResourcesData(locale)
  
  if (!category) return resources
  
  return resources.filter(resource => resource.category === category)
} 