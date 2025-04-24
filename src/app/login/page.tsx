'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiArrowLeft, FiLogIn } from 'react-icons/fi';
import { useTranslations } from 'next-intl';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function LoginPage() {
  const t = useTranslations('Login');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lidar com erros de login
  useEffect(() => {
    const errorFromParams = searchParams.get('error');
    if (errorFromParams) {
      // Obter mensagem de erro apropriada ou usar a mensagem padrão
      let errorMessage = t('errors.default');
      try {
        const key = `errors.${errorFromParams}`;
        errorMessage = t(key as any);
      } catch (e) {
        // Se a chave não existir, usar a mensagem padrão
      }
        
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [searchParams, t]);

  // Função para fazer login com Google
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      toast.error(t('errors.default'));
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md px-4">
      {error && (
        <div className="bg-destructive/15 text-destructive rounded-lg p-3 mb-4 text-center">
          {error}
        </div>
      )}
      
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('title')}</CardTitle>
          <CardDescription className="text-center">{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full flex items-center gap-2 justify-center"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <FiLogIn className="h-4 w-4" />
            {t('google')}
          </Button>
          
          <div className="flex items-center gap-2 my-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-muted-foreground text-sm">{t('or')}</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          
          <Button variant="outline" asChild>
            <Link href="/" className="w-full flex items-center gap-2 justify-center">
              <FiArrowLeft className="h-4 w-4" />
              {t('backToHome')}
            </Link>
          </Button>
        </CardContent>
        <CardFooter>
          <p className="w-full text-center text-sm text-muted-foreground">
            {t('footer')}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 