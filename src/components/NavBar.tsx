'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useLocale } from './Providers';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function NavBar() {
  const t = useTranslations('NavBar');
  const themeT = useTranslations('Index.theme');
  const { locale, setLocale } = useLocale();
  const { setTheme } = useTheme();

  const toggleLocale = () => {
    const newLocale = locale === 'pt-BR' ? 'en' : 'pt-BR';
    setLocale(newLocale);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold inline-block">FURIA Connect</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80">
              {t('home')}
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground/80">
              {t('about')}
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground/80">
              {t('contact')}
            </Link>
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLocale}
            className="h-8 px-3"
          >
            {locale === 'pt-BR' ? '🇧🇷 PT-BR' : '🇺🇸 EN'}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <FiSun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <FiMoon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <FiSun className="mr-2 h-4 w-4" />
                <span>{themeT('light')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <FiMoon className="mr-2 h-4 w-4" />
                <span>{themeT('dark')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <FiMonitor className="mr-2 h-4 w-4" />
                <span>{themeT('system')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
} 