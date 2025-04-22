# 吉卜力风格AI工具爬虫

这个项目用于爬取、处理和整理吉卜力风格AI工具信息，为GenerateGhibli网站提供资源数据。

## 目录结构

```
ghibli_tools_scraper/
├── src/                  # 源代码目录
│   ├── __init__.py       # 包初始化文件
│   ├── scraper.py        # 爬虫模块
│   ├── processor.py      # 数据处理模块
│   ├── detail_scraper.py # 详情页爬取模块
│   ├── resource_formatter.py # 资源格式化模块
│   └── archive/          # 旧版本脚本存档
├── data/                 # 原始数据目录
│   ├── ghibli_tools.json       # 原始爬取的工具数据
│   └── toolify_response.html   # 保存的HTML响应
├── output/               # 输出数据目录
│   ├── processed_ghibli_tools.json     # 处理后的工具数据
│   ├── ghibli_tools_with_details.json  # 包含详情的工具数据
│   ├── ghibli_resources_simple.json    # 精简版资源JSON
│   ├── ghibli_tools_list.md            # Markdown格式的工具列表
│   └── ghibli_resources.json           # 适用于GenerateGhibli项目的JSON资源数据
├── run.py               # 主运行脚本
├── requirements.txt     # 依赖包列表
└── README.md            # 项目说明文档
```

## 安装

1. 克隆仓库:
   ```bash
   git clone https://github.com/GenerateGhibli/ghibli-tools-scraper.git
   cd ghibli-tools-scraper
   ```

2. 安装依赖:
   ```bash
   pip install -r requirements.txt
   ```

## 使用方法

### 运行完整流程

```bash
./run.py
```

### 只执行爬取步骤

```bash
./run.py --scrape-only
```

### 只执行处理步骤

```bash
./run.py --process-only
```

### 只执行详情页爬取步骤

```bash
./run.py --details-only
```

### 只执行资源格式化步骤

```bash
./run.py --format-only
```

### 使用自定义关键词

```bash
./run.py --keyword "studio ghibli"
```

### 设置详情页爬取延迟

```bash
./run.py --delay 3.5
```

### 显示详细输出

```bash
./run.py --verbose
```

## 功能模块

### 爬虫模块 (scraper.py)

`GhibliToolScraper` 类负责从Toolify.ai爬取与吉卜力风格相关的AI工具信息。主要功能包括：

- 使用多种选择器策略提高爬取成功率
- 提取工具名称、链接、描述、标签和图片URL
- 保存原始数据到JSON文件
- 保存HTML响应用于调试

### 数据处理模块 (processor.py)

`GhibliToolProcessor` 类负责处理爬取的数据，主要功能包括：

- 数据清洗：移除重复内容和多余空白
- 数据去重：基于链接和名称相似度进行去重
- 数据格式化：生成多种格式的输出文件

### 详情页爬取模块 (detail_scraper.py)

`GhibliToolDetailScraper` 类负责爬取工具详情页，主要功能包括：

- 提取工具官方网站域名链接
- 获取更详细的工具描述信息
- 更新资源JSON文件，添加域名和详细描述

### 资源格式化模块 (resource_formatter.py)

`GhibliResourceFormatter` 类负责将详情页爬取结果转换为精简的资源JSON格式，主要功能包括：

- 提取域名URL作为资源URL
- 提取详细描述作为资源描述
- 获取网站图标URL
- 生成符合特定结构的精简JSON格式

## 处理流程

1. **数据爬取**：
   - 访问Toolify.ai搜索页面
   - 使用多种选择器策略查找工具卡片
   - 提取工具名称、链接、描述、标签和图片URL
   - 保存原始数据到JSON文件

2. **数据清洗**：
   - 移除重复内容和多余空白
   - 标准化文本格式
   - 清理标签中的重复内容

3. **数据去重**：
   - 基于链接进行初步去重
   - 基于名称相似度进行进一步去重
   - 合并相似工具的标签和描述

4. **详情页爬取**：
   - 访问每个工具的详情页
   - 提取官方网站域名链接
   - 获取更详细的描述信息

5. **资源格式化**：
   - 提取域名URL作为资源URL
   - 提取详细描述作为资源描述
   - 获取网站图标URL
   - 生成精简版资源JSON

## 输出文件

- **processed_ghibli_tools.json**: 处理后的工具数据，包含名称、链接、描述、标签和图片URL
- **ghibli_tools_with_details.json**: 包含详情页信息的工具数据，增加了域名链接和详细描述
- **ghibli_resources_simple.json**: 精简版资源JSON，符合特定结构
- **ghibli_tools_list.md**: Markdown格式的工具列表，方便查看
- **ghibli_resources.json**: 适用于GenerateGhibli项目的标准化JSON资源数据

## 精简版资源JSON结构

```json
{
  "name": "工具名称",
  "description": "详细描述",
  "url": "域名链接",
  "icon": "网站图标URL",
  "category": "tools"
}
```

## 注意事项

- 爬虫脚本可能需要根据网站结构变化进行调整
- 数据处理脚本中的去重逻辑可以根据需要进行优化
- 详情页爬取可能会受到网站反爬虫措施的影响，建议设置适当的延迟时间
- 图标URL获取可能会因网站结构不同而失败，此时会使用默认路径
- 生成的JSON资源数据可以直接导入到GenerateGhibli项目中使用

## 贡献

欢迎提交问题和改进建议！请通过GitHub Issues或Pull Requests参与项目开发。

## 许可证

MIT
