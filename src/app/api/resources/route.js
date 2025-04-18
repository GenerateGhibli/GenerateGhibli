import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { Buffer } from 'buffer';
import fs from 'fs';
import path from 'path';

// 引用zh和en资源数据
import zhResourcesData from '../../../../data/locales/zh/json/resources.json';
import enResourcesData from '../../../../data/locales/en/json/resources.json';

/* eslint-disable no-undef */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // 强制动态渲染此路由

// GitHub配置
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;

const octokit = GITHUB_TOKEN ? new Octokit({
  auth: GITHUB_TOKEN
}) : null;

const owner = GITHUB_OWNER;
const repo = GITHUB_REPO;
const zhResourcesPath = 'data/locales/zh/json/resources.json';
const enResourcesPath = 'data/locales/en/json/resources.json';
/* eslint-enable no-undef */

// 本地文件路径
const LOCAL_DATA_DIR = path.join('../../../../data/locales');

// 保存资源到本地文件
async function saveLocalResources(resources, locale) {
  try {
    const filePath = path.join(LOCAL_DATA_DIR, locale, 'json', 'resources.json');
    const dirPath = path.dirname(filePath);
    
    // 确保目录存在
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(resources, null, 2), 'utf8');
    console.log(`成功保存资源到本地文件: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`保存本地文件失败:`, error);
    return false;
  }
}

async function getResourcesFromGitHub(locale) {
  // 如果GitHub配置不可用，返回本地数据
  if (!octokit || !owner || !repo) {
    console.log('GitHub配置不可用，使用本地数据');
    return getLocalResources(locale);
  }
  
  const path = locale === 'zh' ? zhResourcesPath : enResourcesPath;
  
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: path,
    });

    // 使用Buffer，因为我们在nodejs环境中
    const content = Buffer.from(data.content, 'base64').toString('utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error fetching ${locale} resources from GitHub:`, error);
    // 如果GitHub请求失败，回退到本地数据
    return getLocalResources(locale);
  }
}

// 返回本地资源数据
function getLocalResources(locale) {
  return locale === 'zh' ? zhResourcesData : enResourcesData;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const source = searchParams.get('source');
  const locale = searchParams.get('locale') || 'en';

  if (source === 'github') {
    try {
      const resources = await getResourcesFromGitHub(locale);
      return NextResponse.json(resources);
    } catch (error) {
      console.error('GitHub fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch resources from GitHub' }, { status: 500 });
    }
  } else {
    // 使用静态导入的数据
    const resources = getLocalResources(locale);
    return NextResponse.json(resources);
  }
}

export async function POST(req) {
  const { resources, locale = 'en' } = await req.json();
  
  // 首先尝试保存到本地文件
  const localSaveSuccess = await saveLocalResources(resources, locale);
  
  // 检查GitHub配置是否可用
  if (!octokit || !owner || !repo) {
    if (localSaveSuccess) {
      return NextResponse.json({ success: true, message: '资源已保存到本地文件' });
    } else {
      return NextResponse.json({ error: '无法保存资源' }, { status: 500 });
    }
  }
  
  // 尝试更新GitHub仓库
  const path = locale === 'zh' ? zhResourcesPath : enResourcesPath;

  try {
    const { data: currentFile } = await octokit.repos.getContent({
      owner,
      repo,
      path: path,
    });

    // 使用Buffer，因为我们在nodejs环境中
    const content = Buffer.from(JSON.stringify(resources, null, 2)).toString('base64');

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: path,
      message: `Update ${locale} resources`,
      content,
      sha: currentFile.sha,
    });

    return NextResponse.json({ success: true, message: '资源已更新到GitHub和本地' });
  } catch (error) {
    console.error(`Error updating ${locale} resources on GitHub:`, error);
    // 如果至少保存到了本地，仍然返回成功
    if (localSaveSuccess) {
      return NextResponse.json({ 
        success: true, 
        message: '资源已保存到本地，但GitHub更新失败',
        error: error.message 
      });
    } else {
      return NextResponse.json({ error: '无法保存资源' }, { status: 500 });
    }
  }
}