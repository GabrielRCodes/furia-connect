import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales } from './config';

// Define middleware para next-intl que vai processar todos os requests
export default async function middleware(request: NextRequest) {
  // Obter locale do cookie
  const localeCookie = request.cookies.get('NEXT_LOCALE');
  // console.log(`Middleware - Cookie NEXT_LOCALE: ${localeCookie?.value || 'não encontrado'}`);
  
  // Usar locale do cookie ou pt-BR como padrão
  const locale = localeCookie && locales.includes(localeCookie.value as any) 
    ? localeCookie.value 
    : 'pt-BR';

  // Definir o locale no cabeçalho para o next-intl
  const response = NextResponse.next();
  
  // Adicionar o locale como cabeçalho
  response.headers.set('x-next-intl-locale', locale);
  // console.log(`Middleware - Cabeçalho definido: x-next-intl-locale = ${locale}`);
  
  // Se não tiver cookie, definir pt-BR como padrão
  if (!localeCookie) {
    // console.log('Middleware - Definindo cookie padrão pt-BR');
    response.cookies.set({
      name: 'NEXT_LOCALE',
      value: 'pt-BR',
      path: '/',
      maxAge: 31536000, // 1 ano
      sameSite: 'strict'
    });
  }
  
  return response;
}

export const config = {
  // Aplicar middleware a todas as rotas exceto as especificadas
  matcher: ['/((?!api|_next|.*\\..*).*)']
}; 