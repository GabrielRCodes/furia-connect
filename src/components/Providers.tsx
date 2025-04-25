'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import Cookies from 'js-cookie';
import { PreferencesModal } from './PreferencesModal';

type LocaleContextType = {
  locale: string;
  setLocale: (locale: string) => void;
  isLoading: boolean;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<string>('pt-BR');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Obter o locale do cookie ao carregar
    const cookieLocale = Cookies.get('NEXT_LOCALE');
    if (cookieLocale) {
      setLocaleState(cookieLocale);
    }
    setIsLoading(false);
  }, []);

  const setLocale = (newLocale: string) => {
    // Salvar no cookie
    Cookies.set('NEXT_LOCALE', newLocale, {
      path: '/',
      expires: 365,
      sameSite: 'strict'
    });
    
    // Atualizar o estado
    setLocaleState(newLocale);
    
    // Recarregar a página para aplicar a nova linguagem
    window.location.reload();
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, isLoading }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}

// Combinar todos os providers para facilitar o uso
export function Providers({ children }: { children: ReactNode }) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <LocaleProvider>
        <PreferencesModal />
        {children}
      </LocaleProvider>
    </NextThemeProvider>
  );
} 