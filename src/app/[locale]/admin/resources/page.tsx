import React from 'react';
import ResourcesClient from './ResourcesClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Resources | GenerateGhibli',
  description: '管理网站资源',
};

export default function ResourcesPage({ params }: { params: { locale: string } }) {
  return (
    <div className="container mx-auto py-8">
      <ResourcesClient locale={params.locale} />
    </div>
  );
}
