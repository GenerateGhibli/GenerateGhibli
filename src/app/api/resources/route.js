import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { Buffer } from 'buffer';

// 静态导入资源数据
import resourcesData from '../../../../data/json/resources.json';

/* eslint-disable no-undef */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // 强制动态渲染此路由

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const githubPath = 'data/json/resources.json';
/* eslint-enable no-undef */

async function getResourcesFromGitHub() {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: githubPath,
    });

    // 使用Buffer，因为我们在nodejs环境中
    const content = Buffer.from(data.content, 'base64').toString('utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error fetching resources from GitHub:', error);
    throw error;
  }
}

// 使用静态导入的数据，不再从文件系统读取
function getLocalResources() {
  return resourcesData;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const source = searchParams.get('source');

  if (source === 'github') {
    try {
      const resources = await getResourcesFromGitHub();
      return NextResponse.json(resources);
    } catch (error) {
      console.error('GitHub fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch resources from GitHub' }, { status: 500 });
    }
  } else {
    // 使用静态导入的数据
    const resources = getLocalResources();
    return NextResponse.json(resources);
  }
}

export async function POST(req) {
  const updatedResources = await req.json();

  try {
    const { data: currentFile } = await octokit.repos.getContent({
      owner,
      repo,
      path: githubPath,
    });

    // 使用Buffer，因为我们在nodejs环境中
    const content = Buffer.from(JSON.stringify(updatedResources, null, 2)).toString('base64');

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: githubPath,
      message: 'Update resources',
      content,
      sha: currentFile.sha,
    });

    // 不再更新本地文件
    // 在Cloudflare环境中，更新应该通过GitHub来进行

    return NextResponse.json(updatedResources);
  } catch (error) {
    console.error('Error updating resources:', error);
    return NextResponse.json({ error: 'Failed to update resources' }, { status: 500 });
  }
}