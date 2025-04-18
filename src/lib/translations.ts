// 导入翻译文件
import enTranslations from "../../messages/en.json";
import zhTranslations from "../../messages/zh.json";

// 支持的语言列表
export const SUPPORTED_LOCALES = ['en', 'zh'] as const;
export type Locale = typeof SUPPORTED_LOCALES[number];
export const DEFAULT_LOCALE: Locale = 'en';

// 翻译类型声明
export type TranslationNamespace = 'common' | 'admin' | 'home' | 'resources' | 'articles';

// 确保类型安全
export interface HomeTranslations {
  title: string;
  subtitle: string;
  description: string;
  exploreButton: string;
  learnMore: string;
  resourcesTitle: string;
  articlesTitle: string;
}

export interface CommonTranslations {
  home: string;
  resources: string;
  tutorials: string;
  login: string;
  logout: string;
  admin: string;
  about: string;
  aboutText: string;
  quickLinks: string;
  connect: string;
  allRightsReserved: string;
  aiTools: string;
  modelGuides: string;
  inspirationGallery: string;
  searchPlaceholder: string;
  featuredResources: string;
  latestInspiration: string;
  readMore: string;
  viewAll: string;
  toolsCollection: string;
  modelsCollection: string;
  inspirationCollection: string;
  galleryCollection: string;
}

export interface ResourcesTranslations {
  title: string;
  description: string;
  tools: string;
  models: string;
  inspiration: string;
  allResources: string;
}

export interface ArticlesTranslations {
  title: string;
  readMore: string;
}

export interface AdminTranslations {
  dashboard: string;
  createPost: string;
  manageResources: string;
  backToDashboard: string;
}

export interface Translations {
  common: CommonTranslations;
  admin: AdminTranslations;
  home: HomeTranslations;
  resources: ResourcesTranslations;
  articles: ArticlesTranslations;
}

// 翻译对象映射
const translations: Record<Locale, Translations> = {
  en: enTranslations as Translations,
  zh: zhTranslations as Translations
};

/**
 * 获取特定语言的翻译
 * @param locale - 语言代码
 * @returns 翻译对象
 */
export function getTranslations(locale: string): Translations {
  // 确保使用有效的语言
  const validLocale = SUPPORTED_LOCALES.includes(locale as Locale) ? locale as Locale : DEFAULT_LOCALE;
  return translations[validLocale];
}

/**
 * 获取特定命名空间的翻译
 * @param namespace - 翻译命名空间
 * @param locale - 语言代码 
 * @returns 特定命名空间的翻译对象
 */
export function getNamespaceTranslations<T extends TranslationNamespace>(
  namespace: T, 
  locale: string
): T extends 'home' 
  ? HomeTranslations 
  : T extends 'common' 
    ? CommonTranslations 
    : T extends 'resources'
      ? ResourcesTranslations
      : T extends 'articles'
        ? ArticlesTranslations
        : T extends 'admin'
          ? AdminTranslations
          : Record<string, string> {
  const trans = getTranslations(locale);
  return trans[namespace] as any;
}
