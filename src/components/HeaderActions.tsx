'use client';

import { useSession, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FiSun, FiMoon, FiGlobe, FiMessageSquare, FiSettings, FiLogOut, FiLogIn } from 'react-icons/fi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocale } from '@/components/Providers';
import { usePathname, useRouter } from 'next/navigation';

export function HeaderActions() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, isLoading: isLocaleLoading } = useLocale();
  const [avatarError, setAvatarError] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const t = useTranslations('HeaderActions');
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut({ callbackUrl: '/' });
  };

  // Função para ir para a página de configurações e fechar o modal
  const handleGoToSettings = () => {
    setIsPreferencesOpen(false); // Fecha o modal primeiro
    router.push('/settings'); // Navega para a página de configurações
  };

  // Renderiza o estado de carregamento
  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
        <div className="h-8 w-8 bg-muted animate-pulse rounded-full"></div>
      </div>
    );
  }

  // Usuário não autenticado
  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center space-x-3">
        {/* Botão de troca de tema */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8">
              {theme === 'dark' ? (
                <FiMoon className="h-4 w-4" />
              ) : (
                <FiSun className="h-4 w-4" />
              )}
              <span className="sr-only">{t('theme.toggle')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')}>
              <FiSun className="mr-2 h-4 w-4" />
              <span>{t('theme.light')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              <FiMoon className="mr-2 h-4 w-4" />
              <span>{t('theme.dark')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Botão de troca de idioma */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <FiGlobe className="h-4 w-4" />
              <span className="sr-only">{t('language.toggle')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLocale('pt-BR')}>
              <span>{t('language.portuguese')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLocale('en')}>
              <span>{t('language.english')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Botão de conectar */}
        <Button size="sm" asChild>
          <Link href="/login" className="flex items-center gap-1">
            <FiLogIn className="h-4 w-4" />
            <span>{t('buttons.connect')}</span>
          </Link>
        </Button>
      </div>
    );
  }

  // Usuário autenticado
  return (
    <>
      <div className="flex items-center space-x-3">
        {/* Botão para ir ao chat */}
        {pathname !== "/chat" && pathname !== "/chat/en" && (
          <Button variant="outline" size="sm" asChild>
            <Link href={status === "authenticated" ? "/chat" : "/login"} className="flex items-center gap-1">
              <FiMessageSquare className="h-4 w-4" />
              <span>{t('buttons.chat')}</span>
            </Link>
          </Button>
        )}

        {/* Avatar do usuário - Clicável para abrir modal */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 p-0 rounded-full hover:opacity-60 transition-opacity duration-300 border border-primary"
          onClick={() => setIsPreferencesOpen(true)}
        >
          <Avatar>
            <AvatarImage 
              src={!avatarError ? session?.user?.image || '' : ''} 
              alt={session?.user?.name || 'Avatar'}
              onError={() => setAvatarError(true)}
            />
            <AvatarFallback>
              {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </div>

      {/* Modal de Preferências */}
      <Dialog open={isPreferencesOpen} onOpenChange={setIsPreferencesOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('preferences.title')}</DialogTitle>
            <DialogDescription>
              {t('preferences.description')}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="account" className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">{t('preferences.account')}</TabsTrigger>
              <TabsTrigger value="preferences">{t('preferences.preferences')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account" className="py-4">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage 
                    src={!avatarError ? session?.user?.image || '' : ''} 
                    alt={session?.user?.name || 'Avatar'}
                  />
                  <AvatarFallback className="text-lg">
                    {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="font-medium">{session?.user?.name}</p>
                  <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                </div>

                {/* Botões de ação da conta */}
                <div className="flex space-x-3 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleGoToSettings}
                    className="flex items-center gap-1"
                  >
                      <FiSettings className="h-4 w-4" />
                      <span>{t('buttons.settings')}</span>
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="flex items-center gap-1"
                  >
                    <FiLogOut className="h-4 w-4" />
                    <span>{t('buttons.disconnect')}</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preferences" className="py-4 space-y-6">
              {/* Opção de Tema */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">{t('preferences.theme')}</h4>
                <div className="flex space-x-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('light')}
                    className="flex-1"
                  >
                    <FiSun className="mr-2 h-4 w-4" />
                    {t('theme.light')}
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('dark')}
                    className="flex-1"
                  >
                    <FiMoon className="mr-2 h-4 w-4" />
                    {t('theme.dark')}
                  </Button>
                </div>
              </div>
              
              {/* Opção de Idioma */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">{t('preferences.language')} ({isLocaleLoading ? '...' : locale})</h4>
                <div className="flex space-x-2">
                  <Button
                    variant={locale === 'pt-BR' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLocale('pt-BR')}
                    className="flex-1"
                    disabled={isLocaleLoading}
                  >
                    {t('language.portuguese')}
                  </Button>
                  <Button
                    variant={locale === 'en' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLocale('en')}
                    className="flex-1"
                    disabled={isLocaleLoading}
                  >
                    {t('language.english')}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
} 