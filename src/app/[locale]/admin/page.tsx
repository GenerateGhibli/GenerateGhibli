import React from 'react';
import AdminClient from './AdminClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | GenerateGhibli',
  description: 'GenerateGhibli后台管理系统',
};

export default function AdminPage({ params }: { params: { locale: string } }) {
  return (
    <div className="container mx-auto py-8">
      <AdminClient locale={params.locale} />
    </div>
  );
}
