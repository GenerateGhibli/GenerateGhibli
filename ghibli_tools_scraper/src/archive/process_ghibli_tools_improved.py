import json
import re
from collections import defaultdict

def process_ghibli_tools():
    """
    处理爬取的Ghibli工具数据，去重并格式化，更智能地合并相似工具
    """
    try:
        # 读取原始数据
        with open('ghibli_tools.json', 'r', encoding='utf-8') as f:
            tools = json.load(f)
        
        print(f"读取到 {len(tools)} 个原始工具数据")
        
        # 第一步：基本清理
        cleaned_tools = []
        for tool in tools:
            # 清理数据
            name = tool['name'].strip()
            link = tool['link'].strip() if tool['link'] else ""
            
            # 清理描述中的重复内容和多余空白
            description = tool['description'].strip()
            description = re.sub(r'\s+', ' ', description)  # 替换多个空白为单个空格
            
            # 移除描述中的完全重复部分
            parts = description.split('. ')
            unique_parts = []
            for part in parts:
                if part not in unique_parts:
                    unique_parts.append(part)
            description = '. '.join(unique_parts)
            
            # 清理标签中的重复内容
            tags = list(set(tag.strip() for tag in tool['tags'] if tag.strip()))
            
            cleaned_tools.append({
                "name": name,
                "link": link,
                "description": description,
                "tags": tags,
                "image_url": tool['image_url'].strip() if tool['image_url'] else ""
            })
        
        # 第二步：按名称分组，合并相似工具
        name_groups = defaultdict(list)
        for tool in cleaned_tools:
            # 标准化名称以便分组
            norm_name = re.sub(r'[^a-zA-Z0-9]', '', tool['name'].lower())
            name_groups[norm_name].append(tool)
        
        # 第三步：从每个组中选择最佳代表
        merged_tools = []
        for group_name, group_tools in name_groups.items():
            if len(group_tools) == 1:
                # 只有一个工具，直接添加
                merged_tools.append(group_tools[0])
            else:
                # 多个工具，选择最佳代表
                # 优先选择有链接的工具
                tools_with_links = [t for t in group_tools if t['link']]
                if tools_with_links:
                    # 从有链接的工具中选择描述最长的
                    best_tool = max(tools_with_links, key=lambda t: len(t['description']))
                else:
                    # 如果都没有链接，选择描述最长的
                    best_tool = max(group_tools, key=lambda t: len(t['description']))
                
                # 合并所有标签
                all_tags = []
                for t in group_tools:
                    all_tags.extend(t['tags'])
                best_tool['tags'] = list(set(all_tags))
                
                merged_tools.append(best_tool)
        
        # 第四步：按名称排序
        merged_tools.sort(key=lambda x: x['name'])
        
        # 第五步：过滤掉空链接的工具
        final_tools = [tool for tool in merged_tools if tool['link']]
        
        # 保存处理后的数据
        with open('processed_ghibli_tools.json', 'w', encoding='utf-8') as f:
            json.dump(final_tools, f, ensure_ascii=False, indent=2)
        
        # 生成Markdown格式的工具列表
        with open('ghibli_tools_list.md', 'w', encoding='utf-8') as f:
            f.write("# Ghibli 风格 AI 工具列表\n\n")
            f.write("以下是从 Toolify.ai 爬取的与吉卜力风格相关的 AI 工具列表：\n\n")
            
            for i, tool in enumerate(final_tools, 1):
                f.write(f"## {i}. {tool['name']}\n\n")
                f.write(f"- **链接**: [{tool['link']}]({tool['link']})\n")
                f.write(f"- **描述**: {tool['description']}\n")
                if tool['tags']:
                    f.write(f"- **标签**: {', '.join(tool['tags'])}\n")
                f.write("\n")
            
            # 添加页脚
            f.write("\n---\n\n")
            f.write("*此列表由 GenerateGhibli 项目自动生成，用于收集吉卜力风格的 AI 工具资源。*\n")
            f.write("*数据来源: [Toolify.ai](https://www.toolify.ai/)*\n")
        
        print(f"处理完成，共整理出 {len(final_tools)} 个唯一的 Ghibli 相关工具")
        print(f"结果已保存到 processed_ghibli_tools.json 和 ghibli_tools_list.md")
        
        return final_tools
    
    except Exception as e:
        print(f"处理数据时出错: {e}")
        return []

if __name__ == "__main__":
    process_ghibli_tools()
