import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import matter from 'gray-matter';
import { Buffer } from 'buffer';

/* eslint-disable no-undef */
export const runtime = 'nodejs'; // 指定为Node.js运行时
export const dynamic = 'force-dynamic'; // 强制动态渲染此路由

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const zhArticlesJsonPath = 'data/locales/zh/json/articles.json';
const enArticlesJsonPath = 'data/locales/en/json/articles.json';
const zhMdFolderPath = 'data/locales/zh/md';
const enMdFolderPath = 'data/locales/en/md';
/* eslint-enable no-undef */

export async function POST(request) {
  const { title, description, content, slug, locale = 'en' } = await request.json();

  // Validate slug
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return NextResponse.json({ error: 'Invalid slug format' }, { status: 400 });
  }

  const mdFolderPath = locale === 'zh' ? zhMdFolderPath : enMdFolderPath;
  const path = `${mdFolderPath}/${slug}.md`;

  try {
    // Check if file already exists
    try {
      await octokit.repos.getContent({
        owner,
        repo,
        path,
      });
      return NextResponse.json({ error: `Article with slug "${slug}" already exists for ${locale}` }, { status: 400 });
    } catch (error) {
      if (error.status !== 404) {
        throw error;
      }
    }

    // Create new file
    const fileContent = matter.stringify(content, {
      title,
      description,
      date: new Date().toISOString(),
    });

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `Create new ${locale} article: ${title}`,
      content: Buffer.from(fileContent).toString('base64'),
    });

    // Sync articles
    await syncArticles(locale);

    return NextResponse.json({ message: `Article created successfully for ${locale}` });
  } catch (error) {
    console.error(`Error creating ${locale} article:`, error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}

async function syncArticles(locale = 'en') {
  const mdFolderPath = locale === 'zh' ? zhMdFolderPath : enMdFolderPath;
  const articlesJsonPath = locale === 'zh' ? zhArticlesJsonPath : enArticlesJsonPath;

  try {
    // Fetch all MD files
    const { data: files } = await octokit.repos.getContent({
      owner,
      repo,
      path: mdFolderPath,
    });

    const mdFiles = files.filter(file => file.name.endsWith('.md'));

    const articles = await Promise.all(mdFiles.map(async file => {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path: file.path,
      });

      const content = Buffer.from(data.content, 'base64').toString('utf8');
      const { data: frontMatter } = matter(content);

      // Fetch the last commit for this file
      const { data: commits } = await octokit.repos.listCommits({
        owner,
        repo,
        path: file.path,
        per_page: 1
      });

      const lastModified = commits[0]?.commit.committer.date || data.sha;

      return {
        title: frontMatter.title,
        description: frontMatter.description,
        date: frontMatter.date,
        lastModified: lastModified,
        path: file.path,
      };
    }));

    // Update articles.json
    const { data: currentFile } = await octokit.repos.getContent({
      owner,
      repo,
      path: articlesJsonPath,
    });

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: articlesJsonPath,
      message: `Sync ${locale} articles`,
      content: Buffer.from(JSON.stringify(articles, null, 2)).toString('base64'),
      sha: currentFile.sha,
    });

  } catch (error) {
    console.error(`Error syncing ${locale} articles:`, error);
    throw error;
  }
}