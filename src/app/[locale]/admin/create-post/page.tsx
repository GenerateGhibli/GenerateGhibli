import React from 'react';
import CreatePostClient from './CreatePostClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Post | GenerateGhibli',
  description: '创建新文章',
};

export default function CreatePostPage({ params }: { params: { locale: string } }) {
  return (
    <div className="container mx-auto py-8">
      <CreatePostClient locale={params.locale} />
    </div>
  );
}
