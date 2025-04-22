#!/usr/bin/env python3
"""
吉卜力风格AI工具爬虫 - 爬取模块

此模块负责从Toolify.ai爬取与吉卜力风格相关的AI工具信息。
使用多种选择器策略提高爬取成功率，并保存原始数据到JSON文件。
"""

import requests
from bs4 import BeautifulSoup
import json
import re
import os
import time
from typing import List, Dict, Any, Optional

# 类型别名
ToolInfo = Dict[str, Any]

class GhibliToolScraper:
    """吉卜力风格AI工具爬虫类"""
    
    def __init__(self, base_url: str = "https://www.toolify.ai"):
        """
        初始化爬虫
        
        Args:
            base_url: Toolify.ai的基础URL
        """
        self.base_url = base_url
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Referer": base_url,
        }
        
        # 获取项目根目录
        self.root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.data_dir = os.path.join(self.root_dir, "data")
        
        # 确保数据目录存在
        os.makedirs(self.data_dir, exist_ok=True)
    
    def scrape(self, keyword: str = "ghibli", save_html: bool = True) -> List[ToolInfo]:
        """
        爬取与关键词相关的工具信息
        
        Args:
            keyword: 搜索关键词
            save_html: 是否保存HTML响应
            
        Returns:
            包含工具信息的列表
        """
        url = f"{self.base_url}/zh/search/{keyword}?r=index"
        print(f"正在爬取: {url}")
        
        try:
            # 发送请求
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            
            # 保存HTML以便调试
            if save_html:
                html_path = os.path.join(self.data_dir, "toolify_response.html")
                with open(html_path, 'w', encoding='utf-8') as f:
                    f.write(response.text)
                print(f"已保存HTML响应到 {html_path}")
            
            # 解析HTML
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 尝试不同的选择器来找到工具卡片
            results = self._extract_tools_from_soup(soup, keyword)
            
            # 保存结果到JSON文件
            output_path = os.path.join(self.data_dir, "ghibli_tools.json")
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(results, f, ensure_ascii=False, indent=2)
            
            print(f"爬取完成，共找到 {len(results)} 个 {keyword} 相关内容")
            print(f"结果已保存到 {output_path}")
            return results
            
        except Exception as e:
            print(f"爬取过程中出错: {e}")
            return []
    
    def _extract_tools_from_soup(self, soup: BeautifulSoup, keyword: str) -> List[ToolInfo]:
        """
        从BeautifulSoup对象中提取工具信息
        
        Args:
            soup: BeautifulSoup对象
            keyword: 搜索关键词
            
        Returns:
            包含工具信息的列表
        """
        # 尝试不同的选择器来找到工具卡片
        selectors = [
            '.tool-card',  # 原始选择器
            '.card',       # 常见的卡片类名
            '[class*="card"]',  # 包含card的类名
            '[class*="tool"]',  # 包含tool的类名
            'div[class*="item"]',  # 包含item的div
            'div.MuiCard-root',  # Material UI卡片
            'div.ant-card',      # Ant Design卡片
            'article',           # 可能的文章元素
            '.search-result-item'  # 搜索结果项
        ]
        
        results = []
        found_cards = False
        
        # 尝试每个选择器
        for selector in selectors:
            cards = soup.select(selector)
            if cards:
                print(f"使用选择器 '{selector}' 找到 {len(cards)} 个卡片")
                found_cards = True
                
                # 处理每个卡片
                for card in cards:
                    tool_info = self._extract_tool_from_card(card, keyword)
                    if tool_info:
                        results.append(tool_info)
                
                # 如果找到了卡片并处理完毕，就不再尝试其他选择器
                if results:
                    break
        
        # 如果没有找到卡片，尝试提取页面中所有包含关键词的内容块
        if not found_cards:
            print(f"未找到任何卡片元素，尝试提取页面中所有包含'{keyword}'的内容块")
            results = self._extract_tools_from_paragraphs(soup, keyword)
        
        return results
    
    def _extract_tool_from_card(self, card: BeautifulSoup, keyword: str) -> Optional[ToolInfo]:
        """
        从卡片元素中提取工具信息
        
        Args:
            card: 卡片元素
            keyword: 搜索关键词
            
        Returns:
            工具信息字典，如果不相关则返回None
        """
        try:
            # 尝试提取名称 - 查找各种可能的标题元素
            name = None
            for name_selector in ['h2', 'h3', 'h4', '.title', '[class*="title"]', '[class*="name"]', 'strong', 'b']:
                name_element = card.select_one(name_selector)
                if name_element and name_element.text.strip():
                    name = name_element.text.strip()
                    break
            
            if not name:
                return None  # 如果找不到名称，跳过此卡片
            
            # 提取链接 - 查找卡片中的第一个链接
            link = ""
            link_element = card.select_one('a')
            if link_element:
                link = link_element.get('href', '')
                if link and not link.startswith('http'):
                    link = f"{self.base_url}{link}"
            
            # 提取描述 - 查找各种可能的描述元素
            description = ""
            for desc_selector in ['p', '.description', '[class*="description"]', '[class*="content"]', 'div > span']:
                desc_elements = card.select(desc_selector)
                for desc_element in desc_elements:
                    if desc_element and desc_element.text.strip() and desc_element.text.strip() != name:
                        description = desc_element.text.strip()
                        break
                if description:
                    break
            
            # 提取图片
            img_url = ""
            img_element = card.select_one('img')
            if img_element:
                img_url = img_element.get('src', '')
                if img_url and not img_url.startswith('http'):
                    img_url = f"{self.base_url}{img_url}"
            
            # 提取标签
            tags = []
            for tag_selector in ['.tag', '[class*="tag"]', '.badge', '[class*="badge"]', '.chip', '[class*="chip"]']:
                tag_elements = card.select(tag_selector)
                for tag_element in tag_elements:
                    if tag_element and tag_element.text.strip():
                        tags.append(tag_element.text.strip())
            
            # 检查是否包含关键词 (不区分大小写)
            card_text = card.get_text().lower()
            if keyword.lower() in card_text or re.search(r'吉卜力|宫崎骏', card_text):
                tool_info = {
                    "name": name,
                    "link": link,
                    "description": description,
                    "tags": tags,
                    "image_url": img_url,
                    "raw_text": card_text[:200] + "..." if len(card_text) > 200 else card_text
                }
                
                print(f"找到 {keyword} 相关工具: {name}")
                return tool_info
        
        except Exception as e:
            print(f"处理卡片时出错: {e}")
        
        return None
    
    def _extract_tools_from_paragraphs(self, soup: BeautifulSoup, keyword: str) -> List[ToolInfo]:
        """
        从段落中提取工具信息
        
        Args:
            soup: BeautifulSoup对象
            keyword: 搜索关键词
            
        Returns:
            包含工具信息的列表
        """
        results = []
        paragraphs = soup.find_all(['p', 'div', 'span', 'article'])
        
        for p in paragraphs:
            text = p.get_text().lower()
            if keyword.lower() in text or re.search(r'吉卜力|宫崎骏', text):
                # 尝试找到这个段落的父元素作为一个内容块
                parent = p.parent
                if parent:
                    name = ""
                    for heading in parent.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong']):
                        if heading.text.strip():
                            name = heading.text.strip()
                            break
                    
                    if not name:
                        name = text[:50] + "..." if len(text) > 50 else text
                    
                    link = ""
                    link_element = parent.find('a')
                    if link_element:
                        link = link_element.get('href', '')
                        if link and not link.startswith('http'):
                            link = f"{self.base_url}{link}"
                    
                    img_url = ""
                    img_element = parent.find('img')
                    if img_element:
                        img_url = img_element.get('src', '')
                        if img_url and not img_url.startswith('http'):
                            img_url = f"{self.base_url}{img_url}"
                    
                    results.append({
                        "name": name,
                        "link": link,
                        "description": text,
                        "tags": [],
                        "image_url": img_url,
                        "raw_text": text[:200] + "..." if len(text) > 200 else text
                    })
                    print(f"找到 {keyword} 相关内容: {name[:50]}...")
        
        return results


def main():
    """主函数"""
    start_time = time.time()
    
    scraper = GhibliToolScraper()
    scraper.scrape(keyword="ghibli")
    
    elapsed_time = time.time() - start_time
    print(f"爬取耗时: {elapsed_time:.2f}秒")


if __name__ == "__main__":
    main()
