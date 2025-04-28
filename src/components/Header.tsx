"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  FiMessageCircle, 
  FiGithub, 
  FiYoutube, 
  FiTwitter, 
  FiInstagram,
  FiMenu
} from 'react-icons/fi';
import { SiTwitch, SiDiscord } from 'react-icons/si';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('Header');
  
  // Não renderizar o header na página de login
  if (pathname === '/login' || pathname === '/verify-request') {
    return null;
  }

  return (
    <div className="w-full border-b border-border">
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center py-2 px-4 text-sm">
        {/* Versão Desktop - Links de navegação à esquerda */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#" className="flex items-center text-foreground/70 hover:text-primary transition-colors">
            <FiMessageCircle className="h-5 w-5 stroke-[2.5px]" aria-label={t('navigation.chat')} />
          </Link>
          <Link href="#" className="text-foreground/70 hover:text-primary transition-colors">
            {t('navigation.about')}
          </Link>
          <Link href="#" className="text-foreground/70 hover:text-primary transition-colors">
            {t('navigation.fans')}
          </Link>
          <Link href="#" className="text-foreground/70 hover:text-primary transition-colors">
            {t('navigation.shop')}
          </Link>
          <Link href="#" className="text-foreground/70 hover:text-primary transition-colors">
            {t('navigation.contact')}
          </Link>
        </nav>

        {/* Versão Mobile - Apenas ícone de chat à esquerda */}
        <div className="md:hidden">
          <Link href="#" className="flex items-center text-foreground/70 hover:text-primary transition-colors">
            <FiMessageCircle className="h-5 w-5 stroke-[2.5px]" aria-label={t('navigation.chat')} />
          </Link>
        </div>
        
        {/* Versão Desktop - Redes sociais à direita */}
        <div className="hidden md:flex items-center space-x-4">
          <a href="about:blank" target="_blank" rel="noreferrer" className="text-foreground/70 hover:text-primary transition-colors">
            <FiGithub className="h-4 w-4" aria-label="Github" />
          </a>
          <a href="about:blank" target="_blank" rel="noreferrer" className="text-foreground/70 hover:text-primary transition-colors">
            <SiTwitch className="h-4 w-4" aria-label="Twitch" />
          </a>
          <a href="about:blank" target="_blank" rel="noreferrer" className="text-foreground/70 hover:text-primary transition-colors">
            <FiYoutube className="h-4 w-4" aria-label="Youtube" />
          </a>
          <a href="about:blank" target="_blank" rel="noreferrer" className="text-foreground/70 hover:text-primary transition-colors">
            <FiTwitter className="h-4 w-4" aria-label="Twitter" />
          </a>
          <a href="about:blank" target="_blank" rel="noreferrer" className="text-foreground/70 hover:text-primary transition-colors">
            <FiInstagram className="h-4 w-4" aria-label="Instagram" />
          </a>
          <a href="about:blank" target="_blank" rel="noreferrer" className="text-foreground/70 hover:text-primary transition-colors">
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
              <SheetHeader>
                <SheetTitle>{t('sidebar.title')}</SheetTitle>
              </SheetHeader>
              
              <div className="py-6 space-y-6">
                {/* Links de navegação na sidebar */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">{t('sidebar.navigation')}</h3>
                  <div className="flex flex-col space-y-2">
                    <Link 
                      href="#" 
                      className="flex items-center p-2 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <FiMessageCircle className="h-4 w-4 mr-2" />
                      {t('navigation.chat')}
                    </Link>
                    <Link 
                      href="#" 
                      className="p-2 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {t('navigation.about')}
                    </Link>
                    <Link 
                      href="#" 
                      className="p-2 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {t('navigation.fans')}
                    </Link>
                    <Link 
                      href="#" 
                      className="p-2 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {t('navigation.shop')}
                    </Link>
                    <Link 
                      href="#" 
                      className="p-2 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {t('navigation.contact')}
                    </Link>
                  </div>
                </div>
                
                {/* Redes sociais na sidebar */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">{t('sidebar.socialNetworks')}</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <a 
                      href="about:blank" 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center justify-center p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      <FiGithub className="h-5 w-5" aria-label="Github" />
                    </a>
                    <a 
                      href="about:blank" 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center justify-center p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      <SiTwitch className="h-5 w-5" aria-label="Twitch" />
                    </a>
                    <a 
                      href="about:blank" 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center justify-center p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      <FiYoutube className="h-5 w-5" aria-label="Youtube" />
                    </a>
                    <a 
                      href="about:blank" 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center justify-center p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      <FiTwitter className="h-5 w-5" aria-label="Twitter" />
                    </a>
                    <a 
                      href="about:blank" 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center justify-center p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      <FiInstagram className="h-5 w-5" aria-label="Instagram" />
                    </a>
                    <a 
                      href="about:blank" 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center justify-center p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      <SiDiscord className="h-5 w-5" aria-label="Discord" />
                    </a>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
