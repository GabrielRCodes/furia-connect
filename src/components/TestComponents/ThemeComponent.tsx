'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ThemeComponent() {
  const t = useTranslations('Index.theme');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evitar problemas de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="h-10 w-10 bg-muted rounded"></div>
            <div className="h-10 w-10 bg-muted rounded"></div>
            <div className="h-10 w-10 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant={theme === 'light' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setTheme('light')}
            className="h-10 w-10"
          >
            <FiSun className="h-4 w-4" />
            <span className="sr-only">{t('light')}</span>
          </Button>
          
          <Button
            variant={theme === 'dark' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setTheme('dark')}
            className="h-10 w-10"
          >
            <FiMoon className="h-4 w-4" />
            <span className="sr-only">{t('dark')}</span>
          </Button>
          
          <Button
            variant={theme === 'system' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setTheme('system')}
            className="h-10 w-10"
          >
            <FiMonitor className="h-4 w-4" />
            <span className="sr-only">{t('system')}</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{t(theme as 'light' | 'dark' | 'system')}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <FiSun className="mr-2 h-4 w-4" />
                <span>{t('light')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <FiMoon className="mr-2 h-4 w-4" />
                <span>{t('dark')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <FiMonitor className="mr-2 h-4 w-4" />
                <span>{t('system')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
} 