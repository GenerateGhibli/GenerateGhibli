import json
import re

def process_ghibli_tools():
    """
    处理爬取的Ghibli工具数据，去重并格式化
    """
    try:
        # 读取原始数据
        with open('ghibli_tools.json', 'r', encoding='utf-8') as f:
            tools = json.load(f)
        
        print(f"读取到 {len(tools)} 个原始工具数据")
        
        # 去重 - 使用工具名称和链接作为唯一标识
        unique_tools = {}
        for tool in tools:
            # 清理数据
            name = tool['name'].strip()
            link = tool['link'].strip()
            
            # 清理描述中的重复内容和多余空白
            description = tool['description'].strip()
            description = re.sub(r'\s+', ' ', description)  # 替换多个空白为单个空格
            description = re.sub(r'([^.。!！?？])\1+', r'\1', description)  # 删除重复的句子
            
            # 清理标签中的重复内容
            tags = list(set(tag.strip() for tag in tool['tags'] if tag.strip()))
            
            # 使用名称和链接作为唯一键
            key = f"{name}|{link}"
            
            if key not in unique_tools:
                unique_tools[key] = {
                    "name": name,
                    "link": link,
                    "description": description,
                    "tags": tags,
                    "image_url": tool['image_url'].strip() if tool['image_url'] else ""
                }
        
        # 转换为列表
        processed_tools = list(unique_tools.values())
        
        # 按名称排序
        processed_tools.sort(key=lambda x: x['name'])
        
        # 保存处理后的数据
        with open('processed_ghibli_tools.json', 'w', encoding='utf-8') as f:
            json.dump(processed_tools, f, ensure_ascii=False, indent=2)
        
        # 生成Markdown格式的工具列表
        with open('ghibli_tools_list.md', 'w', encoding='utf-8') as f:
            f.write("# Ghibli 风格 AI 工具列表\n\n")
            f.write("以下是从 Toolify.ai 爬取的与吉卜力风格相关的 AI 工具列表：\n\n")
            
            for i, tool in enumerate(processed_tools, 1):
                f.write(f"## {i}. {tool['name']}\n\n")
                f.write(f"- **链接**: [{tool['link']}]({tool['link']})\n")
                f.write(f"- **描述**: {tool['description']}\n")
                if tool['tags']:
                    f.write(f"- **标签**: {', '.join(tool['tags'])}\n")
                f.write("\n")
        
        print(f"处理完成，共整理出 {len(processed_tools)} 个唯一的 Ghibli 相关工具")
        print(f"结果已保存到 processed_ghibli_tools.json 和 ghibli_tools_list.md")
        
        return processed_tools
    
    except Exception as e:
        print(f"处理数据时出错: {e}")
        return []

if __name__ == "__main__":
    process_ghibli_tools()
