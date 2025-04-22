#!/usr/bin/env python3
"""
吉卜力风格AI工具爬虫 - 主运行脚本
"""

import os
import time
import argparse
import sys
from src.scraper import GhibliToolScraper
from src.processor import GhibliToolProcessor
from src.detail_scraper import GhibliToolDetailScraper
from src.resource_formatter import GhibliResourceFormatter

def main():
    """主函数，运行完整流程"""
    parser = argparse.ArgumentParser(description="吉卜力风格AI工具爬虫")
    parser.add_argument("--scrape-only", action="store_true", help="只执行爬取步骤")
    parser.add_argument("--process-only", action="store_true", help="只执行处理步骤")
    parser.add_argument("--details-only", action="store_true", help="只执行详情页爬取步骤")
    parser.add_argument("--format-only", action="store_true", help="只执行资源格式化步骤")
    parser.add_argument("--verbose", "-v", action="store_true", help="显示详细输出")
    parser.add_argument("--keyword", "-k", default="ghibli", help="搜索关键词 (默认: ghibli)")
    parser.add_argument("--delay", "-d", type=float, default=2.0, help="详情页爬取间隔时间(秒) (默认: 2.0)")
    args = parser.parse_args()
    
    start_time = time.time()
    
    print("\n🚀 开始吉卜力风格AI工具爬取和处理流程")
    
    # 确保在脚本所在目录运行
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    # 获取项目目录
    root_dir = script_dir
    data_dir = os.path.join(root_dir, "data")
    output_dir = os.path.join(root_dir, "output")
    
    # 确保目录存在
    os.makedirs(data_dir, exist_ok=True)
    os.makedirs(output_dir, exist_ok=True)
    
    # 根据参数决定执行哪些步骤
    if args.scrape_only:
        print("\n" + "="*60)
        print(f"执行: 爬取吉卜力风格AI工具数据 (关键词: {args.keyword})")
        print("="*60)
        
        scraper = GhibliToolScraper()
        scraper.scrape(keyword=args.keyword)
        
        print("\n✅ 爬取吉卜力风格AI工具数据完成")
    
    elif args.process_only:
        print("\n" + "="*60)
        print("执行: 处理和整理工具数据")
        print("="*60)
        
        processor = GhibliToolProcessor()
        processor.process()
        
        print("\n✅ 处理和整理工具数据完成")
    
    elif args.details_only:
        print("\n" + "="*60)
        print(f"执行: 爬取工具详情页 (延迟: {args.delay}秒/请求)")
        print("="*60)
        
        detail_scraper = GhibliToolDetailScraper()
        detail_scraper.delay = args.delay
        detail_scraper.scrape_details()
        
        print("\n✅ 爬取工具详情页完成")
    
    elif args.format_only:
        print("\n" + "="*60)
        print("执行: 格式化资源数据")
        print("="*60)
        
        formatter = GhibliResourceFormatter()
        formatter.format_resources()
        
        print("\n✅ 格式化资源数据完成")
    
    else:
        # 执行完整流程
        print("\n" + "="*60)
        print(f"执行: 爬取吉卜力风格AI工具数据 (关键词: {args.keyword})")
        print("="*60)
        
        scraper = GhibliToolScraper()
        scraper.scrape(keyword=args.keyword)
        
        print("\n✅ 爬取吉卜力风格AI工具数据完成")
        
        print("\n" + "="*60)
        print("执行: 处理和整理工具数据")
        print("="*60)
        
        processor = GhibliToolProcessor()
        processor.process()
        
        print("\n✅ 处理和整理工具数据完成")
        
        print("\n" + "="*60)
        print(f"执行: 爬取工具详情页 (延迟: {args.delay}秒/请求)")
        print("="*60)
        
        detail_scraper = GhibliToolDetailScraper()
        detail_scraper.delay = args.delay
        detail_scraper.scrape_details()
        
        print("\n✅ 爬取工具详情页完成")
        
        print("\n" + "="*60)
        print("执行: 格式化资源数据")
        print("="*60)
        
        formatter = GhibliResourceFormatter()
        formatter.format_resources()
        
        print("\n✅ 格式化资源数据完成")
    
    # 计算总耗时
    elapsed_time = time.time() - start_time
    minutes, seconds = divmod(elapsed_time, 60)
    
    print("\n" + "="*60)
    print(f"🎉 全部流程完成! 总耗时: {int(minutes)}分{int(seconds)}秒")
    print("="*60)
    
    # 显示生成的文件
    print("\n📁 生成的文件:")
    files_to_check = {
        os.path.join(data_dir, "ghibli_tools.json"): "原始爬取数据",
        os.path.join(output_dir, "processed_ghibli_tools.json"): "处理后的工具数据",
        os.path.join(output_dir, "ghibli_tools_with_details.json"): "包含详情的工具数据",
        os.path.join(output_dir, "ghibli_tools_list.md"): "Markdown格式工具列表",
        os.path.join(output_dir, "ghibli_resources.json"): "项目资源JSON",
        os.path.join(output_dir, "ghibli_resources_simple.json"): "精简版资源JSON"
    }
    
    for filepath, description in files_to_check.items():
        if os.path.exists(filepath):
            size_kb = os.path.getsize(filepath) / 1024
            print(f"  - {filepath} ({size_kb:.1f} KB): {description}")
    
    print("\n📊 数据统计:")
    try:
        import json
        with open(os.path.join(data_dir, "ghibli_tools.json"), "r", encoding="utf-8") as f:
            raw_count = len(json.load(f))
        with open(os.path.join(output_dir, "processed_ghibli_tools.json"), "r", encoding="utf-8") as f:
            processed_count = len(json.load(f))
        
        print(f"  - 原始爬取数据: {raw_count}个工具条目")
        print(f"  - 去重后的唯一工具: {processed_count}个工具")
        print(f"  - 去重率: {(1 - processed_count/raw_count)*100:.1f}%")
        
        # 如果有详情数据，显示详情统计
        details_path = os.path.join(output_dir, "ghibli_tools_with_details.json")
        if os.path.exists(details_path):
            with open(details_path, "r", encoding="utf-8") as f:
                details_data = json.load(f)
                
            domain_count = sum(1 for tool in details_data if tool.get("domain_url"))
            desc_count = sum(1 for tool in details_data if tool.get("detailed_description"))
            
            print(f"  - 成功获取域名链接: {domain_count}/{len(details_data)}个工具 ({domain_count/len(details_data)*100:.1f}%)")
            print(f"  - 成功获取详细描述: {desc_count}/{len(details_data)}个工具 ({desc_count/len(details_data)*100:.1f}%)")
        
        # 如果有精简版资源数据，显示图标统计
        simple_path = os.path.join(output_dir, "ghibli_resources_simple.json")
        if os.path.exists(simple_path):
            with open(simple_path, "r", encoding="utf-8") as f:
                simple_data = json.load(f)
                
            icon_count = sum(1 for resource in simple_data if resource.get("icon"))
            
            print(f"  - 成功获取图标URL: {icon_count}/{len(simple_data)}个资源 ({icon_count/len(simple_data)*100:.1f}%)")
    except Exception as e:
        print(f"  无法读取统计数据: {e}")
    
    print("\n💡 提示: 您可以在 output/ghibli_resources_simple.json 中查看精简版资源数据")
    print("   或者使用 output/ghibli_tools_list.md 查看格式化的工具列表")

if __name__ == "__main__":
    main()
