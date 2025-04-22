#!/usr/bin/env python3
"""
吉卜力风格AI工具爬虫 - 详情页爬取模块

此模块负责爬取已获取工具的详情页，提取域名链接和更详细的描述信息。
"""

import json
import os
import time
import re
import requests
from bs4 import BeautifulSoup
from typing import Dict, List, Any, Optional, Tuple
from urllib.parse import urlparse

# 类型别名
ToolInfo = Dict[str, Any]

class GhibliToolDetailScraper:
    """吉卜力风格AI工具详情页爬虫类"""
    
    def __init__(self):
        """初始化详情页爬虫"""
        # 获取项目根目录
        self.root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.data_dir = os.path.join(self.root_dir, "data")
        self.output_dir = os.path.join(self.root_dir, "output")
        
        # 确保输出目录存在
        os.makedirs(self.output_dir, exist_ok=True)
        
        # 请求头
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        }
        
        # 延迟时间(秒)，避免请求过快
        self.delay = 2
    
    def scrape_details(self, input_file: str = None, output_file: str = None) -> List[ToolInfo]:
        """
        爬取工具详情页信息
        
        Args:
            input_file: 输入文件路径，如果为None则使用默认路径
            output_file: 输出文件路径，如果为None则使用默认路径
            
        Returns:
            包含详情信息的工具列表
        """
        if input_file is None:
            input_file = os.path.join(self.output_dir, "processed_ghibli_tools.json")
        
        if output_file is None:
            output_file = os.path.join(self.output_dir, "ghibli_tools_with_details.json")
        
        try:
            # 读取处理后的工具数据
            with open(input_file, 'r', encoding='utf-8') as f:
                tools = json.load(f)
            
            print(f"读取到 {len(tools)} 个工具数据，准备爬取详情页")
            
            # 爬取每个工具的详情页
            enriched_tools = []
            for i, tool in enumerate(tools):
                print(f"[{i+1}/{len(tools)}] 正在爬取: {tool['name']}")
                
                if not tool['link'] or tool['link'].strip() == "":
                    print(f"  跳过: 链接为空")
                    enriched_tools.append(tool)
                    continue
                
                try:
                    # 爬取详情页
                    details = self._scrape_tool_detail(tool['link'])
                    
                    # 合并详情信息到工具数据
                    enriched_tool = {**tool, **details}
                    enriched_tools.append(enriched_tool)
                    
                    # 显示获取到的信息
                    print(f"  ✓ 域名: {details.get('domain_url', '未找到')}")
                    print(f"  ✓ 详细描述: {details.get('detailed_description', '未找到')[:50]}...")
                    
                    # 延迟一段时间，避免请求过快
                    time.sleep(self.delay)
                    
                except Exception as e:
                    print(f"  ✗ 爬取失败: {e}")
                    enriched_tools.append(tool)
            
            # 保存结果
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(enriched_tools, f, ensure_ascii=False, indent=2)
            
            print(f"\n详情页爬取完成，结果已保存到 {output_file}")
            
            # 同时更新资源JSON
            self._update_resources_json(enriched_tools)
            
            return enriched_tools
            
        except Exception as e:
            print(f"爬取详情页过程中出错: {e}")
            return []
    
    def _scrape_tool_detail(self, url: str) -> Dict[str, str]:
        """
        爬取单个工具的详情页
        
        Args:
            url: 工具详情页URL
            
        Returns:
            包含域名和详细描述的字典
        """
        details = {
            "domain_url": "",
            "detailed_description": ""
        }
        
        try:
            # 发送请求
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            
            # 解析HTML
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 提取域名链接
            domain_url = self._extract_domain_url(soup, url)
            if domain_url:
                details["domain_url"] = domain_url
            
            # 提取详细描述
            detailed_description = self._extract_detailed_description(soup)
            if detailed_description:
                details["detailed_description"] = detailed_description
            
            return details
            
        except Exception as e:
            print(f"  爬取详情页 {url} 时出错: {e}")
            return details
    
    def _extract_domain_url(self, soup: BeautifulSoup, original_url: str) -> str:
        """
        从详情页提取域名链接
        
        Args:
            soup: BeautifulSoup对象
            original_url: 原始URL，用于备用
            
        Returns:
            域名链接
        """
        # 方法0: 专门针对toolify.ai页面上的"打开网站"按钮
        if "toolify.ai" in original_url:
            # 查找"打开网站"按钮
            open_website_buttons = []
            
            # 查找包含"打开网站"文本的元素
            for span in soup.find_all("span"):
                if span.get_text() and ("打开网站" in span.get_text() or "Open Website" in span.get_text() or "View Website" in span.get_text()):
                    # 找到包含此span的a标签
                    parent = span.parent
                    while parent and parent.name != "a":
                        parent = parent.parent
                    
                    if parent and parent.name == "a" and parent.get("href"):
                        open_website_buttons.append(parent)
            
            # 如果找到"打开网站"按钮，返回其href属性
            if open_website_buttons:
                return open_website_buttons[0].get("href", "")
            
            # 查找可能的"打开网站"按钮类
            button_selectors = [
                "a.to-view-btn", 
                "a[class*='view-btn']",
                "a[class*='open']",
                "a.flex-1",
                "a.bg-purple-1300",
                "a[target='_blank']"
            ]
            
            for selector in button_selectors:
                buttons = soup.select(selector)
                if buttons:
                    for button in buttons:
                        # 检查按钮内是否包含"打开"、"open"、"view"等文本
                        button_text = button.get_text().lower()
                        if any(keyword in button_text for keyword in ["打开", "open", "view", "visit", "try"]):
                            return button.get("href", "")
        
        # 方法1: 查找包含"官方网站"、"官网"、"网站"、"website"、"official"等关键词的链接
        keywords = ["官方网站", "官网", "网站", "website", "official", "homepage", "home page", "visit", "try", "open"]
        for keyword in keywords:
            links = soup.find_all("a", text=lambda t: t and keyword.lower() in t.lower())
            if links:
                return links[0].get("href", "")
        
        # 方法2: 查找包含这些关键词的父元素中的链接
        for keyword in keywords:
            elements = soup.find_all(text=lambda t: t and keyword.lower() in t.lower())
            for element in elements:
                parent = element.parent
                if parent:
                    link = parent.find("a")
                    if link and link.get("href"):
                        return link.get("href", "")
        
        # 方法3: 查找大按钮或突出显示的链接
        button_links = soup.select("a.button, a.btn, a.cta, a[class*='button'], a[class*='btn']")
        if button_links:
            return button_links[0].get("href", "")
        
        # 方法4: 从原始URL中提取域名
        try:
            parsed_url = urlparse(original_url)
            base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
            
            # 如果是toolify.ai，尝试从页面内容中查找真实域名
            if "toolify.ai" in base_url:
                # 查找所有外部链接
                external_links = []
                for link in soup.find_all("a", href=True):
                    href = link.get("href", "")
                    if href and not href.startswith(("#", "/")):
                        if "toolify.ai" not in href and "javascript:" not in href:
                            external_links.append(href)
                
                # 如果找到外部链接，返回第一个
                if external_links:
                    return external_links[0]
            
            return base_url
        except:
            return ""
    
    def _extract_detailed_description(self, soup: BeautifulSoup) -> str:
        """
        从详情页提取详细描述
        
        Args:
            soup: BeautifulSoup对象
            
        Returns:
            详细描述文本
        """
        # 尝试多种方法提取详细描述
        
        # 方法1: 查找描述区域
        description_selectors = [
            "meta[name='description']",
            ".description", 
            "#description",
            "[class*='description']",
            ".about", 
            "#about",
            ".intro", 
            "#intro",
            ".overview", 
            "#overview",
            "section p",
            "article p",
            ".content p"
        ]
        
        for selector in description_selectors:
            if selector.startswith("meta"):
                meta = soup.select_one(selector)
                if meta and meta.get("content"):
                    return meta.get("content").strip()
            else:
                elements = soup.select(selector)
                if elements:
                    # 合并多个段落
                    text = " ".join([el.get_text().strip() for el in elements if el.get_text().strip()])
                    if len(text) > 50:  # 只接受长度超过50的文本
                        return text
        
        # 方法2: 提取页面中最长的段落
        paragraphs = soup.find_all("p")
        if paragraphs:
            longest_p = max(paragraphs, key=lambda p: len(p.get_text().strip()) if p.get_text() else 0)
            if longest_p and len(longest_p.get_text().strip()) > 50:
                return longest_p.get_text().strip()
        
        # 方法3: 提取页面中的所有文本并清理
        body_text = soup.body.get_text(" ", strip=True) if soup.body else ""
        if body_text:
            # 清理文本
            body_text = re.sub(r'\s+', ' ', body_text)
            # 提取最长的句子
            sentences = re.split(r'[.!?。！？]', body_text)
            if sentences:
                longest_sentence = max(sentences, key=lambda s: len(s.strip()))
                if len(longest_sentence.strip()) > 50:
                    return longest_sentence.strip()
        
        return ""
    
    def _update_resources_json(self, enriched_tools: List[ToolInfo]) -> None:
        """
        更新资源JSON文件，添加域名和详细描述
        
        Args:
            enriched_tools: 包含详情信息的工具列表
        """
        resources_path = os.path.join(self.output_dir, "ghibli_resources.json")
        
        try:
            # 读取现有资源文件
            with open(resources_path, 'r', encoding='utf-8') as f:
                resources = json.load(f)
            
            # 更新资源信息
            for resource in resources:
                # 查找对应的工具
                for tool in enriched_tools:
                    if resource["name"] == tool["name"]:
                        # 更新域名链接
                        if tool.get("domain_url"):
                            resource["domain_url"] = tool["domain_url"]
                        
                        # 如果详细描述比原描述长，则更新
                        if tool.get("detailed_description") and len(tool.get("detailed_description", "")) > len(resource["description"]):
                            resource["detailed_description"] = tool["detailed_description"]
                        
                        break
            
            # 保存更新后的资源文件
            with open(resources_path, 'w', encoding='utf-8') as f:
                json.dump(resources, f, ensure_ascii=False, indent=2)
            
            print(f"资源文件已更新: {resources_path}")
            
        except Exception as e:
            print(f"更新资源文件时出错: {e}")


def main():
    """主函数"""
    start_time = time.time()
    
    scraper = GhibliToolDetailScraper()
    scraper.scrape_details()
    
    elapsed_time = time.time() - start_time
    print(f"详情页爬取耗时: {elapsed_time:.2f}秒")


if __name__ == "__main__":
    main()
