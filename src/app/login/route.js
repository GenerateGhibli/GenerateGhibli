import { NextResponse } from 'next/server';
import { defaultLocale } from '@/i18n/index';

export function GET() {
  return NextResponse.redirect(new URL(`/${defaultLocale}/login`, 'http://localhost:3000'));
}
