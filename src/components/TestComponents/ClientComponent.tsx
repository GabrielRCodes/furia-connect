'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from '@/components/Providers';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ClientComponent() {
  const t = useTranslations('Index.client');
  const { locale, setLocale, isLoading } = useLocale();

  const toggleLocale = () => {
    const newLocale = locale === 'pt-BR' ? 'en' : 'pt-BR';
    setLocale(newLocale);
  };

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          {isLoading ? (
            <>
              <p className="text-xs mb-2 text-muted-foreground">Idioma atual: ...</p>
              <Button 
                onClick={toggleLocale}
                disabled
              >
                {t('button')}
              </Button>
            </>
          ) : (
            <>
              <p className="text-xs mb-2 text-muted-foreground">Idioma atual: {locale}</p>
              <Button 
                onClick={toggleLocale}
                variant="default"
              >
                {t('button')}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 