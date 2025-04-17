import React from 'react';
import LoginClient from './LoginClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | GenerateGhibli',
  description: '登录到GenerateGhibli管理面板',
};

export default function LoginPage({ params }: { params: { locale: string } }) {
  return (
    <div className="container mx-auto py-8">
      <LoginClient locale={params.locale} />
    </div>
  );
}
