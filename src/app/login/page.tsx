'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiArrowLeft, FiLogIn, FiMail } from 'react-icons/fi';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { checkLoginRate } from '../actions';
import Image from 'next/image';

export default function LoginPage() {
  const t = useTranslations('Login');
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Lidar com erros de login
  useEffect(() => {
    const errorFromParams = searchParams.get('error');
    if (errorFromParams) {
      // Obter mensagem de erro apropriada ou usar a mensagem padrão
      let errorMessage = t('errors.default');
      try {
        const key = `errors.${errorFromParams}`;
        errorMessage = t(key as keyof typeof t);
      } catch {
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
      
      // Verificar se o usuário pode tentar login
      const rateCheck = await checkLoginRate('google_login', 60);
      if (rateCheck.status !== 200) {
        toast.error(rateCheck.message);
        setIsLoading(false);
        return;
      }
      
      await signIn('google', { callbackUrl: '/' });
    } catch {
      toast.error(t('errors.default'));
      setIsLoading(false);
    }
  };

  // Função para fazer login com Email
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error(t('emailRequired'));
      return;
    }

    try {
      setIsLoading(true);
      
      // Verificar se o usuário pode tentar login com email
      const rateCheck = await checkLoginRate('email_login', 600);
      if (rateCheck.status !== 200) {
        toast.error(rateCheck.message);
        setIsLoading(false);
        return;
      }
      
      // Usando o signIn com o provider 'resend' (ID do nosso provider personalizado)
      await signIn('resend', {
        email,
        callbackUrl: '/verify-request',
        redirect: true
      });
      
    } catch {
      toast.error(t('errors.default'));
      setIsLoading(false);
    }
  };

  return (
    <div className="w-auto md:w-full max-w-5xl px-4">
      {error && (
        <div className="bg-destructive/15 text-destructive rounded-lg p-3 mb-4 text-center">
          {error}
        </div>
      )}
      
      <Card className="shadow-lg overflow-hidden p-0">
        <div className="flex flex-col md:flex-row p-6 gap-6">
          <div className="relative w-full md:w-1/2 h-40 md:h-[550px] hidden md:block rounded-lg overflow-hidden">
            <Image 
              src="https://res.cloudinary.com/dnuayiowd/image/upload/v1745690690/Torcida-FURIA-IEM-Rio-Major-2022_xkft48.jpg"
              alt="Torcida FURIA"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
          
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <div className="text-center mb-4 mx-auto max-w-xs space-y-1">
              <h2 className="text-2xl font-semibold">{t('title')}</h2>
              <p className="text-muted-foreground">{t('description')}</p>
            </div>
            
            <div className="max-w-xs mx-auto w-full">
              <Tabs defaultValue="social" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="social">{t('socialLogin')}</TabsTrigger>
                  <TabsTrigger value="email">{t('emailLogin')}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="social" className="space-y-4">
                  <Button
                    className="w-full flex items-center gap-2 justify-center"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    <FiLogIn className="h-4 w-4" />
                    {t('google')}
                  </Button>
                </TabsContent>
                
                <TabsContent value="email">
                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        type="email"
                        placeholder={t('emailPlaceholder')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      <FiMail className="mr-2 h-4 w-4" />
                      {t('continueWithEmail')}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
              
              <div className="flex items-center gap-2 my-4">
                <div className="h-px flex-1 bg-border" />
                <span className="text-muted-foreground text-sm">{t('or')}</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              
              <Button variant="ghost" asChild className="w-full">
                <Link href="/" className="flex items-center gap-2">
                  <FiArrowLeft className="h-4 w-4" />
                  {t('backToHome')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="text-center text-sm text-muted-foreground mt-6">
        {t('footer')}
      </div>
    </div>
  );
} 