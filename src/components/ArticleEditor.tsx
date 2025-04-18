'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getNamespaceTranslations, LocaleString, TranslationNamespace, EditorTranslations } from '@/lib/translations';

interface Article {
  title: string;
  description: string;
  content: string;
  path: string;
}

interface ArticleEditorProps {
  locale?: LocaleString;
}

export default function ArticleEditor({ locale: propLocale }: ArticleEditorProps) {
  const [article, setArticle] = useState<Article>({ title: '', description: '', content: '', path: '' });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const path = searchParams.get('path');
  
  // 从路径中提取locale或使用props中提供的locale
  const locale = (propLocale || pathname.split('/')[1] || 'en') as LocaleString;
  
  // 获取翻译
  const t = getNamespaceTranslations(locale, 'editor' as TranslationNamespace) as unknown as EditorTranslations;

  useEffect(() => {
    if (path) {
      fetchArticle(decodeURIComponent(path));
    } else {
      setError(t.noArticlePath || 'No article path provided');
      setIsLoading(false);
    }
  }, [path, locale, t]);

  const fetchArticle = async (articlePath: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/articles?path=${encodeURIComponent(articlePath)}&locale=${locale}`);
      if (!response.ok) {
        throw new Error(t.fetchError || 'Failed to fetch article');
      }
      const data = await response.json();
      setArticle(data);
    } catch (error) {
      console.error('Error fetching article:', error);
      setError(t.fetchErrorTryAgain || 'Failed to fetch article. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setArticle({ ...article, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          article,
          locale 
        }),
      });
      if (!response.ok) {
        throw new Error(t.saveError || 'Failed to save article');
      }
      alert(t.saveSuccess || 'Article saved successfully');
    } catch (error) {
      console.error('Error saving article:', error);
      setError(t.saveErrorTryAgain || 'Failed to save article. Please try again.');
    }
  };

  if (isLoading) return <div>{t.loading || 'Loading article...'}</div>;
  if (error) return <div>{t.error || 'Error'}: {error}</div>;

  return (
    <div className="space-y-4">
      <Input
        name="title"
        value={article.title}
        onChange={handleInputChange}
        placeholder={t.titlePlaceholder || "Article Title"}
      />
      <Input
        name="description"
        value={article.description}
        onChange={handleInputChange}
        placeholder={t.descriptionPlaceholder || "Article Description"}
      />
      <Textarea
        name="content"
        value={article.content}
        onChange={handleInputChange}
        placeholder={t.contentPlaceholder || "Article Content"}
        rows={20}
      />
      <Button onClick={handleSave}>{t.saveButton || "Save Article"}</Button>
    </div>
  );
}