'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useTheme } from 'next-themes';
import { Dialog, DialogContent as BaseDialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import React from 'react';
import { useLocale } from './Providers';

// Cookie Name
const PREFERENCES_COOKIE = 'preferencesSelected';
// Cookie Expiry (10 years in days)
const COOKIE_EXPIRY = 365 * 10;

// DialogContent customizado com animação de fade-in
const DialogContent = React.forwardRef<
  React.ElementRef<typeof BaseDialogContent>,
  React.ComponentPropsWithoutRef<typeof BaseDialogContent>
>(({ className, ...props }, ref) => (
  <BaseDialogContent
    ref={ref}
    className={cn(
      "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
      className
    )}
    {...props}
  />
));
DialogContent.displayName = 'CustomDialogContent';

export function PreferencesModal() {
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('pt-BR');
  const [selectedTheme, setSelectedTheme] = useState('dark');
  const { setTheme } = useTheme();
  const { locale, setLocale, isLoading } = useLocale();

  // Verificar se as preferências já foram selecionadas
  useEffect(() => {
    
    const preferencesSelected = Cookies.get(PREFERENCES_COOKIE);
    
    if (!preferencesSelected) {
      setOpen(true);
    } 

  }, []);
  
  // Sincronizar o estado local com o contexto quando não estiver carregando
  useEffect(() => {
    if (!isLoading) {
      setSelectedLanguage(locale);
    }
  }, [isLoading, locale]);

  // Salvar preferências e fechar o modal
  const savePreferences = () => {
    const preferences = {
      language: selectedLanguage,
      theme: selectedTheme
    };
    
    // Salvar no cookie com validade de 10 anos
    Cookies.set(PREFERENCES_COOKIE, JSON.stringify(preferences), { 
      expires: COOKIE_EXPIRY, 
      path: '/' 
    });
    
    // Aplicar tema
    setTheme(selectedTheme);
    
    // Aplicar idioma usando o contexto
    if (selectedLanguage !== locale) {
      setLocale(selectedLanguage);
    }
    
    setOpen(false);
  };

  return (
    <>
      <style jsx global>{`
        [data-radix-popper-content-wrapper] button[aria-label="Close"] {
          display: none !important;
        }
      `}</style>
      <Dialog open={open} onOpenChange={(isOpen) => {
        // Impedir que o modal seja fechado sem confirmação
        if (!isOpen && !Cookies.get(PREFERENCES_COOKIE)) {
          return;
        }
        setOpen(isOpen);
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-center">Preferências</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-8">
            {/* Opções de idioma */}
            <div>
              <h3 className="text-sm font-medium mb-3">Selecione seu idioma</h3>
              <div className="grid grid-cols-2 gap-3">
                {/* Português */}
                <button
                  type="button"
                  onClick={() => setSelectedLanguage('pt-BR')}
                  className={cn(
                    "flex items-center justify-center py-2 px-4 border rounded-md transition-all",
                    selectedLanguage === 'pt-BR'
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border hover:border-muted-foreground"
                  )}
                >
                  <span className="text-sm">Português</span>
                </button>
                
                {/* Inglês */}
                <button
                  type="button"
                  onClick={() => setSelectedLanguage('en')}
                  className={cn(
                    "flex items-center justify-center py-2 px-4 border rounded-md transition-all",
                    selectedLanguage === 'en'
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border hover:border-muted-foreground"
                  )}
                >
                  <span className="text-sm">English US</span>
                </button>
              </div>
            </div>
            
            {/* Opções de tema */}
            <div>
              <h3 className="text-sm font-medium mb-3">Selecione seu tema</h3>
              <div className="grid grid-cols-3 gap-3">
                {/* Claro */}
                <button
                  type="button"
                  onClick={() => setSelectedTheme('light')}
                  className={cn(
                    "flex items-center justify-center py-2 px-3 border rounded-md transition-all",
                    selectedTheme === 'light'
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border hover:border-muted-foreground"
                  )}
                >
                  <span className="text-sm">Claro</span>
                </button>
                
                {/* Escuro */}
                <button
                  type="button"
                  onClick={() => setSelectedTheme('dark')}
                  className={cn(
                    "flex items-center justify-center py-2 px-3 border rounded-md transition-all",
                    selectedTheme === 'dark'
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border hover:border-muted-foreground"
                  )}
                >
                  <span className="text-sm">Escuro</span>
                </button>
                
                {/* Sistema */}
                <button
                  type="button"
                  onClick={() => setSelectedTheme('system')}
                  className={cn(
                    "flex items-center justify-center py-2 px-3 border rounded-md transition-all",
                    selectedTheme === 'system'
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border hover:border-muted-foreground"
                  )}
                >
                  <span className="text-sm">Sistema</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <DialogFooter>
              <Button onClick={savePreferences} className="w-full">
                Confirmar
              </Button>
            </DialogFooter>
            <p className="text-xs text-muted-foreground text-center">
              Estas configurações poderão ser alteradas a qualquer momento.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 