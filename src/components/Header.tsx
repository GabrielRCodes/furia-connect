"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  FiMessageCircle, 
  FiGithub, 
  FiYoutube, 
  FiTwitter, 
  FiInstagram,
  FiMenu,
  FiShoppingBag,
  FiChevronRight,
  FiExternalLink,
  FiHome
} from 'react-icons/fi';
import { SiTwitch, SiDiscord } from 'react-icons/si';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator';

// Custom hook for scroll handling
function useScrollToSection(pathname: string, searchParams: URLSearchParams) {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined' && pathname === '/') {
      const goTo = searchParams.get('goTo');
      if (goTo) {
        // Use requestAnimationFrame to ensure DOM is ready
        window.requestAnimationFrame(() => {
          const element = document.getElementById(goTo);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            
            // Remove the goTo parameter from URL without refreshing
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
          }
        });
      }
    }
  }, [pathname, searchParams]);
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('Header');
  
  // Use the custom scroll hook
  useScrollToSection(pathname, searchParams);
  
  // Scroll handler for navigation links
  const handleNavigation = (sectionId: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    if (pathname === '/') {
      // On homepage, scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // On other pages, redirect to home with query parameter
      router.push(`/?goTo=${sectionId}`);
    }
    // Close mobile menu if open
    if (open) setOpen(false);
  };
  
  // Não renderizar o header na página de login
  if (pathname === '/login' || pathname === '/verify-request') {
    return null;
  }

  return (
    <div className={`w-full border-b border-border`}>
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center py-2 px-4 text-sm">
        {/* Versão Desktop - Links de navegação à esquerda */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="flex items-center text-foreground/70 hover:text-primary transition-colors">
            <FiMessageCircle className="h-5 w-5 stroke-[2.5px]" aria-label={t('navigation.chat')} />
          </Link>
          <a 
            href="#about" 
            className="text-foreground/70 hover:text-primary transition-colors cursor-pointer" 
            onClick={(e) => handleNavigation('about', e)}
          >
            {t('navigation.about')}
          </a>
          <a 
            href="#fans" 
            className="text-foreground/70 hover:text-primary transition-colors cursor-pointer" 
            onClick={(e) => handleNavigation('fans', e)}
          >
            {t('navigation.fans')}
          </a>
          <a 
            href="#shop" 
            className="text-foreground/70 hover:text-primary transition-colors cursor-pointer" 
            onClick={(e) => handleNavigation('shop', e)}
          >
            {t('navigation.shop')}
          </a>
          <a 
            href="#contact" 
            className="text-foreground/70 hover:text-primary transition-colors cursor-pointer" 
            onClick={(e) => handleNavigation('contact', e)}
          >
            {t('navigation.contact')}
          </a>
        </nav>

        {/* Versão Mobile - Apenas ícone de chat à esquerda */}
        <div className="md:hidden">
          <Link href="/" className="flex items-center text-foreground/70 hover:text-primary transition-colors">
            <FiMessageCircle className="h-5 w-5 stroke-[2.5px]" aria-label={t('navigation.chat')} />
          </Link>
        </div>
        
        {/* Versão Desktop - Redes sociais à direita */}
        <div className="hidden md:flex items-center space-x-4">
          <a href="https://github.com/GabrielRCodes" target="_blank" rel="noreferrer" className="text-foreground/70 hover:text-primary transition-colors">
            <FiGithub className="h-4 w-4" aria-label="Github" />
          </a>
          <a href="https://www.twitch.tv/furiatv" target="_blank" rel="noreferrer" className="text-foreground/70 hover:text-primary transition-colors">
            <SiTwitch className="h-4 w-4" aria-label="Twitch" />
          </a>
          <a href="https://www.youtube.com/@FURIAgg" target="_blank" rel="noreferrer" className="text-foreground/70 hover:text-primary transition-colors">
            <FiYoutube className="h-4 w-4" aria-label="Youtube" />
          </a>
          <a href="https://x.com/FURIA" target="_blank" rel="noreferrer" className="text-foreground/70 hover:text-primary transition-colors">
            <FiTwitter className="h-4 w-4" aria-label="Twitter" />
          </a>
          <a href="https://www.instagram.com/furiagg/" target="_blank" rel="noreferrer" className="text-foreground/70 hover:text-primary transition-colors">
            <FiInstagram className="h-4 w-4" aria-label="Instagram" />
          </a>
          <a href="https://discord.gg/48wchPa8NY" target="_blank" rel="noreferrer" className="text-foreground/70 hover:text-primary transition-colors">
            <SiDiscord className="h-4 w-4" aria-label="Discord" />
          </a>
        </div>

        {/* Versão Mobile - Botão de menu à direita */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <FiMenu className="h-5 w-5" />
                <span className="sr-only">{t('sidebar.title')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="overflow-y-auto">
              <SheetHeader className="pb-4">
                <SheetTitle className="text-xl">{t('sidebar.title')}</SheetTitle>
                <SheetDescription>
                  FURIA Connect
                </SheetDescription>
              </SheetHeader>
              
              <Separator className="my-4" />
              
              <div className="py-2 space-y-6">
                {/* Botão de voltar para o início */}
                <Link 
                  href="/" 
                  className="flex items-center justify-between p-3 rounded-md hover:bg-muted border border-border transition-colors group"
                  onClick={() => setOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <FiHome className="h-5 w-5 text-primary" />
                    <span className="font-medium">Voltar para o início</span>
                  </div>
                  <FiChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
                
                {/* Redes sociais na sidebar - estilo card melhorado */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    {t('sidebar.socialNetworks')}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <a 
                      href="https://github.com/GabrielRCodes" 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex flex-col items-center justify-center p-4 rounded-md hover:bg-muted border border-border transition-colors"
                    >
                      <FiGithub className="h-6 w-6 mb-2" aria-label="Github" />
                      <span className="text-xs">GitHub</span>
                    </a>
                    <a 
                      href="https://www.twitch.tv/furiatv" 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex flex-col items-center justify-center p-4 rounded-md hover:bg-muted border border-border transition-colors"
                    >
                      <SiTwitch className="h-6 w-6 mb-2" aria-label="Twitch" />
                      <span className="text-xs">Twitch</span>
                    </a>
                    <a 
                      href="https://www.youtube.com/@FURIAgg" 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex flex-col items-center justify-center p-4 rounded-md hover:bg-muted border border-border transition-colors"
                    >
                      <FiYoutube className="h-6 w-6 mb-2" aria-label="Youtube" />
                      <span className="text-xs">YouTube</span>
                    </a>
                    <a 
                      href="https://x.com/FURIA" 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex flex-col items-center justify-center p-4 rounded-md hover:bg-muted border border-border transition-colors"
                    >
                      <FiTwitter className="h-6 w-6 mb-2" aria-label="Twitter" />
                      <span className="text-xs">Twitter</span>
                    </a>
                    <a 
                      href="https://www.instagram.com/furiagg/" 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex flex-col items-center justify-center p-4 rounded-md hover:bg-muted border border-border transition-colors"
                    >
                      <FiInstagram className="h-6 w-6 mb-2" aria-label="Instagram" />
                      <span className="text-xs">Instagram</span>
                    </a>
                    <a 
                      href="https://discord.gg/48wchPa8NY" 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex flex-col items-center justify-center p-4 rounded-md hover:bg-muted border border-border transition-colors"
                    >
                      <SiDiscord className="h-6 w-6 mb-2" aria-label="Discord" />
                      <span className="text-xs">Discord</span>
                    </a>
                  </div>
                </div>

                <Separator />
                
                {/* Link para a loja */}
                <a 
                  href="https://furia.gg" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-md hover:bg-muted border border-primary/50 transition-colors group"
                  onClick={() => setOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <FiShoppingBag className="h-5 w-5 text-primary" />
                    <span className="font-medium">Visite nossa loja</span>
                  </div>
                  <FiExternalLink className="h-4 w-4 text-primary" />
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
