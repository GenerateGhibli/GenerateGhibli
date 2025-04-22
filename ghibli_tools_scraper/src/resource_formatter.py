#!/usr/bin/env python3
"""
吉卜力风格AI工具爬虫 - 资源格式化模块

此模块负责将详情页爬取结果转换为精简的资源JSON格式。
"""

import json
import os
import requests
from urllib.parse import urlparse
from typing import Dict, List, Any

# 类型别名
ResourceInfo = Dict[str, Any]

class GhibliResourceFormatter:
    """吉卜力资源格式化类"""
    
    def __init__(self):
        """初始化资源格式化器"""
        # 获取项目根目录
        self.root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.output_dir = os.path.join(self.root_dir, "output")
        
        # 确保输出目录存在
        os.makedirs(self.output_dir, exist_ok=True)
        
        # 请求头
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        }
    
    def format_resources(self, input_file: str = None, output_file: str = None) -> List[ResourceInfo]:
        """
        格式化资源数据
        
        Args:
            input_file: 输入文件路径，如果为None则使用默认路径
            output_file: 输出文件路径，如果为None则使用默认路径
            
        Returns:
            格式化后的资源列表
        """
        if input_file is None:
            input_file = os.path.join(self.output_dir, "ghibli_tools_with_details.json")
        
        if output_file is None:
            output_file = os.path.join(self.output_dir, "ghibli_resources_simple.json")
        
        try:
            # 读取详情数据
            with open(input_file, 'r', encoding='utf-8') as f:
                tools = json.load(f)
            
            print(f"读取到 {len(tools)} 个工具详情数据，准备格式化")
            
            # 格式化资源
            resources = []
            for i, tool in enumerate(tools):
                print(f"[{i+1}/{len(tools)}] 正在格式化: {tool['name']}")
                
                # 获取域名URL
                url = tool.get('domain_url', '')
                if not url:
                    url = tool.get('link', '')
                
                # 去除URL中的utm参数
                url = self._clean_url(url)
                
                # 修复特殊情况
                if "kekebe.com" in url and "#tools" in url:
                    url = url.split("#tools")[0]
                
                # 获取描述
                description = tool.get('detailed_description', '')
                if not description:
                    description = tool.get('description', '')
                
                # 获取图标URL
                icon = self._get_favicon_url(url)
                
                # 创建资源对象
                resource = {
                    "name": tool['name'],
                    "description": description,
                    "url": url,
                    "icon": icon,
                    "category": "tools"
                }
                
                resources.append(resource)
                print(f"  ✓ 格式化完成: {resource['name']} -> {resource['url']}")
            
            # 保存结果
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(resources, f, ensure_ascii=False, indent=2)
            
            print(f"\n资源格式化完成，结果已保存到 {output_file}")
            return resources
            
        except Exception as e:
            print(f"格式化资源时出错: {e}")
            return []
    
    def _clean_url(self, url: str) -> str:
        """
        清理URL，去除utm参数等跟踪参数
        
        Args:
            url: 原始URL
            
        Returns:
            清理后的URL
        """
        if not url:
            return ""
        
        try:
            # 解析URL
            from urllib.parse import urlparse, urlunparse, parse_qs
            
            parsed_url = urlparse(url)
            
            # 如果没有查询参数，直接返回
            if not parsed_url.query:
                return url
            
            # 解析查询参数
            query_params = parse_qs(parsed_url.query)
            
            # 移除utm_开头的参数
            cleaned_params = {k: v for k, v in query_params.items() if not k.startswith('utm_')}
            
            # 重建查询字符串
            from urllib.parse import urlencode
            query_string = urlencode(cleaned_params, doseq=True) if cleaned_params else ""
            
            # 重建URL
            cleaned_url = urlunparse((
                parsed_url.scheme,
                parsed_url.netloc,
                parsed_url.path,
                parsed_url.params,
                query_string,
                parsed_url.fragment
            ))
            
            return cleaned_url
        except Exception as e:
            print(f"  清理URL时出错: {e}")
            return url
    
    def _get_favicon_url(self, url: str) -> str:
        """
        获取网站图标URL
        
        Args:
            url: 网站URL
            
        Returns:
            图标URL
        """
        if not url:
            return ""
            
        # 清理URL中的utm参数
        url = self._clean_url(url)
        
        try:
            # 解析URL
            parsed_url = urlparse(url)
            base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
            
            # 常见的图标路径
            favicon_paths = [
                "/favicon.ico",
                "/favicon.png",
                "/apple-touch-icon.png",
                "/apple-touch-icon-precomposed.png"
            ]
            
            # 尝试直接访问常见图标路径
            for path in favicon_paths:
                favicon_url = f"{base_url}{path}"
                try:
                    response = requests.head(favicon_url, headers=self.headers, timeout=3)
                    if response.status_code == 200:
                        return favicon_url
                except:
                    pass
            
            # 如果直接访问失败，尝试从HTML中提取
            try:
                response = requests.get(base_url, headers=self.headers, timeout=5)
                if response.status_code == 200:
                    from bs4 import BeautifulSoup
                    soup = BeautifulSoup(response.text, 'html.parser')
                    
                    # 查找link标签中的图标
                    for link in soup.find_all('link'):
                        rel = link.get('rel', [])
                        if isinstance(rel, list):
                            rel = ' '.join(rel).lower()
                        else:
                            rel = rel.lower()
                        
                        if 'icon' in rel or 'shortcut icon' in rel:
                            href = link.get('href', '')
                            if href:
                                if href.startswith('http'):
                                    return href
                                elif href.startswith('//'):
                                    return f"{parsed_url.scheme}:{href}"
                                elif href.startswith('/'):
                                    return f"{base_url}{href}"
                                else:
                                    return f"{base_url}/{href}"
            except:
                pass
            
            # 如果都失败了，返回默认图标路径
            return f"{base_url}/favicon.ico"
            
        except Exception as e:
            print(f"  获取图标URL时出错: {e}")
            return ""


def main():
    """主函数"""
    import time
    start_time = time.time()
    
    formatter = GhibliResourceFormatter()
    formatter.format_resources()
    
    elapsed_time = time.time() - start_time
    print(f"资源格式化耗时: {elapsed_time:.2f}秒")


if __name__ == "__main__":
    main()
