import {getRequestConfig} from 'next-intl/server';
import {cookies, headers} from 'next/headers';

export default getRequestConfig(async ({locale}) => {
  // console.log(`Request Config - Locale recebido através do parâmetro: ${locale}`);
  
  // Se locale estiver undefined, tente buscar dos cabeçalhos ou cookies
  let safeLocale = locale;
  
  if (!safeLocale) {
    try {
      // Tentar obter do cabeçalho
      const headerList = await headers();
      const headerLocale = headerList.has('x-next-intl-locale') 
        ? headerList.get('x-next-intl-locale') 
        : null;
      
      if (headerLocale) {
        // console.log(`Request Config - Locale encontrado no cabeçalho: ${headerLocale}`);
        safeLocale = headerLocale;
      } else {
        // Tentar obter do cookie
        const cookieStore = await cookies();
        const cookieLocale = cookieStore.has('NEXT_LOCALE') 
          ? cookieStore.get('NEXT_LOCALE')?.value 
          : null;
        
        if (cookieLocale) {
          // console.log(`Request Config - Locale encontrado no cookie: ${cookieLocale}`);
          safeLocale = cookieLocale;
        }
      }
    } catch (error) {
      // Manter os logs de erro para detectar problemas reais
      console.error('Request Config - Erro ao tentar obter locale de cabeçalhos/cookies:', error);
    }
  }
  
  // Fallback para pt-BR se ainda estiver undefined
  safeLocale = safeLocale || 'pt-BR';
  // console.log(`Request Config - Locale final a ser usado: ${safeLocale}`);
  
  try {
    const messages = (await import(`./messages/${safeLocale}.json`)).default;
    // console.log(`Request Config - Mensagens carregadas para: ${safeLocale}`);
    return {
      locale: safeLocale,
      messages
    };
  } catch (error) {
    // Manter os logs de erro para detectar problemas reais
    console.error(`Request Config - Erro ao carregar mensagens para ${safeLocale}:`, error);
    const fallbackMessages = (await import(`./messages/pt-BR.json`)).default;
    return {
      locale: 'pt-BR',
      messages: fallbackMessages
    };
  }
}); 