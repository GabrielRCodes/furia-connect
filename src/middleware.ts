import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, type Locale } from './config';

// Define middleware to process all requests for next-intl
export default async function middleware(request: NextRequest) {
  // Get locale from cookie
  const localeCookie = request.cookies.get('NEXT_LOCALE');
  // console.log(`Middleware - Cookie NEXT_LOCALE: ${localeCookie?.value || 'not found'}`);
  
  // Validate if the cookie value is a valid locale
  const isValidLocale = (value: string | undefined): value is Locale => 
    !!value && locales.includes(value as Locale);
  
  // Use locale from cookie or pt-BR as default
  const locale = localeCookie && isValidLocale(localeCookie.value)
    ? localeCookie.value 
    : 'pt-BR';

  // Check if we need to redirect for chat routes
  if (request.nextUrl.pathname === '/chat') {
    // If locale is English, redirect to English chat
    if (locale === 'en') {
      return NextResponse.redirect(new URL('/chat/en', request.url));
    }
  } else if (request.nextUrl.pathname === '/chat/en') {
    // If locale is Portuguese and user is on English chat page, redirect to Portuguese chat
    if (locale === 'pt-BR') {
      return NextResponse.redirect(new URL('/chat', request.url));
    }
  }

  // Set locale in header for next-intl
  const response = NextResponse.next();
  
  // Add locale as header
  response.headers.set('x-next-intl-locale', locale);
  // console.log(`Middleware - Header set: x-next-intl-locale = ${locale}`);
  
  // If no cookie, set pt-BR as default
  if (!localeCookie) {
    // console.log('Middleware - Setting default cookie pt-BR');
    response.cookies.set({
      name: 'NEXT_LOCALE',
      value: 'pt-BR',
      path: '/',
      maxAge: 31536000, // 1 year
      sameSite: 'strict'
    });
  }
  
  return response;
}

export const config = {
  // Apply middleware to all routes except those specified
  matcher: ['/((?!api|_next|.*\\..*).*)']
}; 