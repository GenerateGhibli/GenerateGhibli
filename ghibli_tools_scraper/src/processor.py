#!/usr/bin/env python3
"""
吉卜力风格AI工具爬虫 - 数据处理模块

此模块负责处理爬取的吉卜力风格AI工具数据，包括去重、清洗和格式化。
生成多种格式的输出文件，包括JSON和Markdown。
"""

import json
import re
import os
import time
from collections import defaultdict
from typing import List, Dict, Any, Optional

# 类型别名
ToolInfo = Dict[str, Any]

class GhibliToolProcessor:
    """吉卜力风格AI工具数据处理类"""
    
    def __init__(self):
        """初始化处理器"""
        # 获取项目根目录
        self.root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.data_dir = os.path.join(self.root_dir, "data")
        self.output_dir = os.path.join(self.root_dir, "output")
        
        # 确保输出目录存在
        os.makedirs(self.output_dir, exist_ok=True)
    
    def process(self, input_file: str = None) -> List[ToolInfo]:
        """
        处理工具数据
        
        Args:
            input_file: 输入文件路径，如果为None则使用默认路径
            
        Returns:
            处理后的工具信息列表
        """
        if input_file is None:
            input_file = os.path.join(self.data_dir, "ghibli_tools.json")
        
        try:
            # 读取原始数据
            with open(input_file, 'r', encoding='utf-8') as f:
                tools = json.load(f)
            
            print(f"读取到 {len(tools)} 个原始工具数据")
            
            # 处理数据
            cleaned_tools = self._clean_tools(tools)
            link_merged_tools = self._merge_by_link(cleaned_tools)
            final_tools = self._merge_by_name(link_merged_tools)
            
            # 保存处理后的数据
            self._save_outputs(final_tools)
            
            return final_tools
            
        except Exception as e:
            print(f"处理数据时出错: {e}")
            return []
    
    def _clean_tools(self, tools: List[ToolInfo]) -> List[ToolInfo]:
        """
        清理工具数据
        
        Args:
            tools: 原始工具数据列表
            
        Returns:
            清理后的工具数据列表
        """
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
        
        return cleaned_tools
    
    def _merge_by_link(self, tools: List[ToolInfo]) -> List[ToolInfo]:
        """
        按链接合并工具
        
        Args:
            tools: 清理后的工具数据列表
            
        Returns:
            按链接合并后的工具数据列表
        """
        # 按链接分组，合并相同链接的工具
        link_groups = defaultdict(list)
        for tool in tools:
            if tool['link']:  # 只处理有链接的工具
                link_groups[tool['link']].append(tool)
        
        # 从每个链接组中选择最佳代表
        merged_tools = []
        
        for link, group_tools in link_groups.items():
            if len(group_tools) == 1:
                # 只有一个工具，直接添加
                merged_tools.append(group_tools[0])
            else:
                # 多个工具，选择名称最长的作为代表
                best_tool = max(group_tools, key=lambda t: len(t['name']))
                
                # 合并所有标签
                all_tags = []
                for t in group_tools:
                    all_tags.extend(t['tags'])
                best_tool['tags'] = list(set(all_tags))
                
                merged_tools.append(best_tool)
        
        return merged_tools
    
    def _merge_by_name(self, tools: List[ToolInfo]) -> List[ToolInfo]:
        """
        按名称合并工具
        
        Args:
            tools: 按链接合并后的工具数据列表
            
        Returns:
            按名称合并后的工具数据列表
        """
        # 进一步合并名称相似的工具
        name_normalized_tools = {}
        
        for tool in tools:
            # 标准化名称（移除空格和特殊字符，转为小写）
            norm_name = re.sub(r'[^a-zA-Z0-9]', '', tool['name'].lower())
            
            if norm_name in name_normalized_tools:
                # 如果已存在相似名称的工具，保留描述更长的那个
                existing_tool = name_normalized_tools[norm_name]
                if len(tool['description']) > len(existing_tool['description']):
                    name_normalized_tools[norm_name] = tool
            else:
                name_normalized_tools[norm_name] = tool
        
        # 转换为列表并排序
        final_tools = list(name_normalized_tools.values())
        final_tools.sort(key=lambda x: x['name'])
        
        return final_tools
    
    def _clean_description(self, description: str) -> str:
        """
        清理描述文本，移除重复句子
        
        Args:
            description: 原始描述文本
            
        Returns:
            清理后的描述文本
        """
        sentences = re.split(r'[.。!！?？]\s*', description)
        unique_sentences = []
        
        for sentence in sentences:
            sentence = sentence.strip()
            if sentence and sentence not in unique_sentences:
                unique_sentences.append(sentence)
        
        clean_description = '. '.join(unique_sentences)
        if clean_description and not clean_description.endswith(('.', '。', '!', '！', '?', '？')):
            clean_description += '.'
        
        return clean_description
    
    def _save_outputs(self, tools: List[ToolInfo]) -> None:
        """
        保存处理结果到多种格式
        
        Args:
            tools: 处理后的工具数据列表
        """
        # 1. 保存处理后的JSON数据
        processed_json_path = os.path.join(self.output_dir, "processed_ghibli_tools.json")
        with open(processed_json_path, 'w', encoding='utf-8') as f:
            json.dump(tools, f, ensure_ascii=False, indent=2)
        
        # 2. 生成Markdown格式的工具列表
        markdown_path = os.path.join(self.output_dir, "ghibli_tools_list.md")
        with open(markdown_path, 'w', encoding='utf-8') as f:
            f.write("# Ghibli 风格 AI 工具列表\n\n")
            f.write("以下是从 Toolify.ai 爬取的与吉卜力风格相关的 AI 工具列表：\n\n")
            
            for i, tool in enumerate(tools, 1):
                f.write(f"## {i}. {tool['name']}\n\n")
                f.write(f"- **链接**: [{tool['link']}]({tool['link']})\n")
                
                # 清理描述
                clean_description = self._clean_description(tool['description'])
                f.write(f"- **描述**: {clean_description}\n")
                
                if tool['tags']:
                    f.write(f"- **标签**: {', '.join(tool['tags'])}\n")
                f.write("\n")
            
            # 添加页脚
            f.write("\n---\n\n")
            f.write("*此列表由 GenerateGhibli 项目自动生成，用于收集吉卜力风格的 AI 工具资源。*\n")
            f.write("*数据来源: [Toolify.ai](https://www.toolify.ai/)*\n")
        
        # 3. 生成适用于GenerateGhibli项目的JSON资源数据
        resources = []
        for tool in tools:
            # 清理描述
            clean_description = self._clean_description(tool['description'])
            
            resources.append({
                "name": tool['name'],
                "description": clean_description,
                "url": tool['link'],
                "imageUrl": tool['image_url'] if tool['image_url'] else "https://generateghibli.org/placeholder.jpg",
                "tags": tool['tags'] if tool['tags'] else ["AI工具"],
                "category": "工具",
                "featured": False
            })
        
        resources_json_path = os.path.join(self.output_dir, "ghibli_resources.json")
        with open(resources_json_path, 'w', encoding='utf-8') as f:
            json.dump(resources, f, ensure_ascii=False, indent=2)
        
        print(f"处理完成，共整理出 {len(tools)} 个唯一的 Ghibli 相关工具")
        print(f"结果已保存到:")
        print(f"  - {processed_json_path}")
        print(f"  - {markdown_path}")
        print(f"  - {resources_json_path}")


def main():
    """主函数"""
    start_time = time.time()
    
    processor = GhibliToolProcessor()
    processor.process()
    
    elapsed_time = time.time() - start_time
    print(f"处理耗时: {elapsed_time:.2f}秒")


if __name__ == "__main__":
    main()
