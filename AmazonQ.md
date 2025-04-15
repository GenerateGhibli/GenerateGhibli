# GitBase 国际化实施指南

本文档介绍了如何在GitBase项目中实现国际化（i18n）支持。

## 已实施的功能

1. 使用 `next-intl` 库实现国际化支持
2. 支持英文（en）和中文（zh）两种语言
3. 实现了语言切换器组件
4. 重构了应用程序结构以支持国际化路由
5. 翻译了主要界面元素

## 文件结构

- `/messages/` - 包含各语言的翻译文件
  - `en.json` - 英文翻译
  - `zh.json` - 中文翻译
- `/src/i18n.js` - 国际化配置
- `/src/middleware.js` - 处理国际化路由的中间件
- `/src/components/LanguageSwitcher.js` - 语言切换器组件
- `/src/app/[locale]/` - 国际化路由结构

## 如何添加新语言

1. 在 `/messages/` 目录下创建新的语言文件，例如 `ja.json` 用于日语
2. 在 `/src/i18n.js` 中的 `locales` 数组中添加新的语言代码
3. 确保所有翻译键都在新语言文件中有对应的翻译

## 如何使用翻译

在组件中使用翻译：

```jsx
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('namespace');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

## 注意事项

- 所有页面组件都应放在 `/src/app/[locale]/` 目录下
- 确保在添加新内容时同时更新所有语言文件
- 使用 `useTranslations` 钩子获取翻译，而不是硬编码文本
