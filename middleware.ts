import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './lib/i18n';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Handle Locale Redirects for Landing/Shared pages
  const response = intlMiddleware(req);

  // 2. Simple Auth Check for Dashboard
  // Check if pathname starts with locale and then /dashboard
  // Example: /en/dashboard or /vi/dashboard
  const isDashboard = locales.some(locale => pathname.startsWith(`/${locale}/dashboard`));
  
  if (isDashboard) {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      // Redirect to login if no token
      const locale = pathname.split('/')[1] || defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }
  }

  return response;
}

export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /_static (inside /public)
  // - /.*\\..* (files with extension like logo.png, favicon.ico)
  // - /_vercel (internals)
  matcher: ['/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)']
};
