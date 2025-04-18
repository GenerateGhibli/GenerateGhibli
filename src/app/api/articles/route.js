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

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sync = searchParams.get('sync');
  const path = searchParams.get('path');
  const locale = searchParams.get('locale') || 'en';

  try {
    if (path) {
      // Fetch single article
      try {
        const { data } = await octokit.repos.getContent({
          owner,
          repo,
          path: decodeURIComponent(path),
        });

        const content = Buffer.from(data.content, 'base64').toString('utf8');
        const { data: frontMatter, content: articleContent } = matter(content);

        return NextResponse.json({
          ...frontMatter,
          content: articleContent,
          path: data.path,
        });
      } catch (error) {
        console.error('Error fetching article:', error);
        return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
      }
    } else if (sync === 'true') {
      await syncArticles(locale);
    }

    const articlesJsonPath = locale === 'zh' ? zhArticlesJsonPath : enArticlesJsonPath;
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: articlesJsonPath,
    });

    const content = Buffer.from(data.content, 'base64').toString('utf8');
    const articles = JSON.parse(content);

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(request) {
  const { article, locale = 'en' } = await request.json();

  try {
    // Update the MD file
    await updateMdFile(article, locale);

    // Sync articles
    await syncArticles(locale);

    return NextResponse.json({ message: 'Article updated successfully' });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
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
      const { data: frontMatter, content: articleContent } = matter(content);

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

async function updateMdFile(article, locale = 'en') {
  try {
    const { data: currentFile } = await octokit.repos.getContent({
      owner,
      repo,
      path: article.path,
    });

    const currentContent = Buffer.from(currentFile.content, 'base64').toString('utf8');
    const { data: frontMatter, content: articleContent } = matter(currentContent);

    const updatedFrontMatter = {
      ...frontMatter,
      title: article.title,
      description: article.description,
      lastModified: new Date().toISOString(),
    };

    const updatedContent = matter.stringify(article.content, updatedFrontMatter);

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: article.path,
      message: `Update ${locale} article: ${article.title}`,
      content: Buffer.from(updatedContent).toString('base64'),
      sha: currentFile.sha,
    });

  } catch (error) {
    console.error(`Error updating ${locale} MD file:`, error);
    throw error;
  }
}