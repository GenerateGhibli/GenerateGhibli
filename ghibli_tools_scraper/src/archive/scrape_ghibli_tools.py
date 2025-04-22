import requests
from bs4 import BeautifulSoup
import json
import time
import random

def scrape_toolify_ghibli():
    """
    爬取 Toolify.ai 上与 Ghibli 相关的工具信息
    """
    url = "https://www.toolify.ai/zh/search/ghibli?r=index"
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Referer": "https://www.toolify.ai/",
    }
    
    try:
        print(f"正在爬取: {url}")
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # 检查请求是否成功
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 查找所有工具卡片
        tool_cards = soup.select('.tool-card')
        
        results = []
        
        for card in tool_cards:
            try:
                # 提取工具名称
                name_element = card.select_one('.tool-name')
                name = name_element.text.strip() if name_element else "未知名称"
                
                # 提取工具链接
                link = ""
                if name_element and name_element.parent and name_element.parent.name == 'a':
                    link = name_element.parent.get('href', '')
                    if link and not link.startswith('http'):
                        link = f"https://www.toolify.ai{link}"
                
                # 提取工具描述
                description_element = card.select_one('.tool-description')
                description = description_element.text.strip() if description_element else "无描述"
                
                # 提取工具标签
                tags = []
                tag_elements = card.select('.tool-tag')
                for tag_element in tag_elements:
                    tags.append(tag_element.text.strip())
                
                # 提取工具图片
                img_element = card.select_one('img')
                img_url = img_element.get('src', '') if img_element else ""
                if img_url and not img_url.startswith('http'):
                    img_url = f"https://www.toolify.ai{img_url}"
                
                # 检查是否包含 Ghibli 关键词
                if ('ghibli' in name.lower() or 
                    'ghibli' in description.lower() or 
                    any('ghibli' in tag.lower() for tag in tags)):
                    
                    tool_info = {
                        "name": name,
                        "link": link,
                        "description": description,
                        "tags": tags,
                        "image_url": img_url
                    }
                    
                    results.append(tool_info)
                    print(f"找到 Ghibli 相关工具: {name}")
            
            except Exception as e:
                print(f"处理工具卡片时出错: {e}")
        
        # 保存结果到 JSON 文件
        with open('ghibli_tools.json', 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        
        print(f"爬取完成，共找到 {len(results)} 个 Ghibli 相关工具")
        return results
    
    except Exception as e:
        print(f"爬取过程中出错: {e}")
        return []

if __name__ == "__main__":
    scrape_toolify_ghibli()
