import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { Buffer } from 'buffer';

// 引用zh和en资源数据
import zhResourcesData from '../../../../data/locales/zh/json/resources.json';
import enResourcesData from '../../../../data/locales/en/json/resources.json';

/* eslint-disable no-undef */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // 强制动态渲染此路由

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const zhResourcesPath = 'data/locales/zh/json/resources.json';
const enResourcesPath = 'data/locales/en/json/resources.json';
/* eslint-enable no-undef */

async function getResourcesFromGitHub(locale) {
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
    throw error;
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

    return NextResponse.json(resources);
  } catch (error) {
    console.error(`Error updating ${locale} resources:`, error);
    return NextResponse.json({ error: 'Failed to update resources' }, { status: 500 });
  }
}