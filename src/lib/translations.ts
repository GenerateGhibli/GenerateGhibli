// 导入翻译文件
import enTranslations from '../../messages/en.json';
import zhTranslations from '../../messages/zh.json';

// 支持的语言
export const supportedLocales = ['en', 'zh'] as const;
export type SupportedLocale = typeof supportedLocales[number];
export type LocaleString = string;

// 翻译命名空间
export type TranslationNamespace = 'common' | 'home' | 'articles' | 'resources' | 'admin' | 'editor' | 'navigation' | 'footer';

// 基础翻译类型
export interface Translations {
  [key: string]: string;
}

// 特定命名空间的翻译接口
export interface CommonTranslations {
  title?: string;
  description?: string;
  home: string;
  resources: string;
  tutorials: string;
  login?: string;
  logout?: string;
  admin?: string;
  about: string;
  aboutText: string;
  quickLinks: string;
  connect: string;
  allRightsReserved: string;
  aiTools?: string;
  modelGuides?: string;
  inspirationGallery?: string;
  searchPlaceholder?: string;
  featuredResources?: string;
  latestInspiration?: string;
  readMore: string;
  viewAll: string;
  toolsCollection?: string;
  modelsCollection?: string;
  inspirationCollection?: string;
  galleryCollection?: string;
  createdAt?: string;
  updatedAt?: string;
  moreArticles?: string;
  allResources: string;
}

export interface HomeTranslations {
  heroTitle: string;
  heroSubtitle: string;
  featuredArticles: string;
  featuredResources: string;
}

export interface ArticlesTranslations {
  title: string;
  description: string;
  readTime: string;
  minutesToRead: string;
  publishedOn: string;
  latestArticles: string;
}

export interface ResourcesTranslations {
  title: string;
  description: string;
  categories: string;
  tools: string;
  models: string;
  tutorials: string;
}

export interface AdminTranslations {
  dashboard: string;
  createPost: string;
  manageResources: string;
  backToDashboard: string;
  addResource: string;
  editResource: string;
  resourceName: string;
  resourceDesc: string;
  resourceUrl: string;
  save: string;
  update: string;
  cancel: string;
  edit: string;
  delete: string;
  confirmDelete: string;
  loading: string;
  resourcesList: string;
  title: string;
  description: string;
  content: string;
  path: string;
  continue: string;
}

// 编辑器翻译接口
export interface EditorTranslations {
  noArticlePath: string;
  fetchError: string;
  fetchErrorTryAgain: string;
  saveError: string;
  saveSuccess: string;
  saveErrorTryAgain: string;
  loading: string;
  error: string;
  titlePlaceholder: string;
  descriptionPlaceholder: string;
  contentPlaceholder: string;
  saveButton: string;
}

// 导航翻译接口
export interface NavigationTranslations {
  home: string;
  articles: string;
  resources: string;
  admin: string;
}

// 页脚翻译接口
export interface FooterTranslations {
  copyright: string;
  allRightsReserved: string;
  poweredBy: string;
}

// 获取翻译的函数
export function getNamespaceTranslations(locale: LocaleString, namespace: TranslationNamespace): Translations {
  const safeLocale = supportedLocales.includes(locale as SupportedLocale) ? locale : 'en';
  
  const translations = {
    en: enTranslations,
    zh: zhTranslations
  };
  
  // 安全地访问翻译，如果不存在则返回空对象
  const localeTranslations = translations[safeLocale as SupportedLocale];
  
  // 检查命名空间是否存在
  if (localeTranslations && typeof localeTranslations === 'object' && namespace in localeTranslations) {
    return localeTranslations[namespace as keyof typeof localeTranslations] as Translations;
  }
  
  // 返回空对象作为后备
  return {};
}

// 获取完整翻译的函数
export function getTranslations(locale: LocaleString): object {
  const safeLocale = supportedLocales.includes(locale as SupportedLocale) ? locale : 'en';
  
  const translations = {
    en: enTranslations,
    zh: zhTranslations
  };
  
  return translations[safeLocale as SupportedLocale] || {};
}
