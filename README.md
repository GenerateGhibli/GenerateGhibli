# GenerateGhibli

[GenerateGhibli](https://generateghibli.org/) 是您的吉卜力风格AI图像生成资源导航站。发现精选的AI工具、模型和灵感，轻松创建宫崎骏和吉卜力工作室风格的魔幻世界和角色。

![GenerateGhibli](https://toimg.xyz/file/5aa892c8e8385232fcdf3.png)

## 部署在 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FGenerateGhibli%2FGenerateGhibli&project-name=GenerateGhibli&repository-name=GenerateGhibli&external-id=https%3A%2F%2Fgithub.com%2FGenerateGhibli%2FGenerateGhibli%2Ftree%2Fmain)

## 功能特点

- **全面的资源集合**：精选的吉卜力风格AI图像生成工具和模型
- **灵感画廊**：展示社区创作的吉卜力风格AI艺术作品
- **创作指南**：专为各种AI图像生成器优化的吉卜力风格提示词
- **模型推荐**：最适合创建吉卜力风格艺术的AI模型评测和推荐
- **多语言支持**：支持英文和中文
- **响应式设计**：使用Tailwind CSS实现的完全响应式设计
- **SEO优化**：通过服务器端渲染和增强元数据提升搜索引擎可见性

## 最新开发进度

### 国际化与管理功能优化 (2025-04-16)

- **国际化框架修复**：
  - 修复了客户端组件中的国际化上下文问题
  - 解决了`useTranslations`钩子在客户端组件中的错误
  - 使用`NextIntlClientProvider`正确包装客户端组件
  - 创建了`getMessages`辅助函数以简化国际化实现

- **管理界面重构**：
  - 重新设计了管理员仪表板页面
  - 实现了创建文章和管理资源的路由结构
  - 修复了管理页面和登录页面的404错误
  - 优化了页面间的导航流程

- **路由结构优化**：
  - 统一使用`[locale]`路由模式，确保所有页面支持国际化
  - 删除了冗余的非国际化路由
  - 修复了页面间导航的链接问题
  - 确保所有客户端路由跳转保留语言参数

- **组件架构改进**：
  - 将页面逻辑分离为服务器组件和客户端组件
  - 服务器组件负责数据获取和国际化配置
  - 客户端组件处理交互和状态管理
  - 提高了代码的可维护性和性能

### SEO优化 (2025-04-15)

- **服务器端渲染改进**：
  - 将客户端组件转换为服务器组件，提高搜索引擎索引效率
  - 创建静态组件替代带有"use client"指令的客户端组件
  - 实现了StaticResourceList、StaticArticleList和StaticGhibliNavigation等服务器组件

- **元数据增强**：
  - 更新所有page.tsx文件，添加全面的SEO元数据
  - 实现关键词、描述和OpenGraph数据，提高搜索可见性
  - 优化标题和描述以提高点击率

- **路由优化**：
  - 实现文章详情页面的正确路由，修复404错误
  - 添加[locale]/posts/[id]/page.tsx路由结构
  - 创建示例文章内容，提供吉卜力风格AI艺术指南

- **可访问性改进**：
  - 实现适当的HTML语义结构
  - 添加ARIA属性，提高可访问性
  - 在静态组件中实现国际化支持

## 前提条件

- Node.js (14版本或更高)
- npm (随Node.js一起安装)
- Git
- GitHub账户
- Vercel账户 (用于部署)

## 安装

1. 克隆仓库:
   ```
   git clone https://github.com/GenerateGhibli/GenerateGhibli.git
   cd GenerateGhibli
   ```

2. 安装依赖:
   ```
   npm install
   ```

3. 在根目录创建`.env.local`文件并添加以下内容:
   ```
   GITHUB_TOKEN=your_github_personal_access_token
   GITHUB_OWNER=your_github_username
   GITHUB_REPO=your_repo_name
   ACCESS_PASSWORD=your_secure_access_password
   ```

4. 设置GitHub仓库:
   - 在GitHub上创建一个新仓库
   - 在仓库中创建两个文件夹: `data/json` 和 `data/md`
   - 在 `data/json` 中创建一个名为 `resources.json` 的文件，内容为空数组: `[]`

5. 运行开发服务器:
   ```
   npm run dev
   ```

访问 `http://localhost:3000` 查看本地运行的GenerateGhibli实例。

## 资源分类

- **工具**: 用于生成吉卜力风格图像的AI工具和平台
- **模型**: 为吉卜力美学风格优化的AI模型
- **灵感**: 吉卜力风格AI艺术创作的灵感来源
- **提示词**: 创建特定吉卜力元素的优化提示词

## 贡献

我们欢迎对GenerateGhibli的贡献！请访问我们的[GitHub仓库](https://github.com/GenerateGhibli/GenerateGhibli)提交问题或拉取请求。

## 许可证

GenerateGhibli是根据[MIT许可证](https://github.com/GenerateGhibli/GenerateGhibli/?tab=MIT-1-ov-file)授权的开源软件。

## 支持

如果您遇到任何问题或有疑问，请在GitHub仓库上提交issue。

## 致谢

GenerateGhibli使用以下开源库构建:
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/UI](https://ui.shadcn.com/)

我们感谢这些项目的维护者和贡献者。
