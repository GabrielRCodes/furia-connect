'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function VerifyRequestPage() {
  const t = useTranslations('VerifyRequest');
  const [email, setEmail] = useState<string | null>(null);
  
  useEffect(() => {
    // Ler o cookie diretamente usando js-cookie
    const emailFromCookie = Cookies.get('verification_email');
    if (emailFromCookie) {
      setEmail(emailFromCookie);
    }
  }, []);
  
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">{t('title')}</CardTitle>
            <CardDescription className="text-center mt-2">
              {t('description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            {email && (
              <div className="bg-muted p-3 rounded-md flex items-center justify-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-primary" />
                <p className="font-medium">{t('emailSentTo')} <span className="text-primary">{email}</span></p>
              </div>
            )}
            <p className="text-muted-foreground">
              {t('checkInbox')}
            </p>
            <p className="text-muted-foreground">
              {t('checkSpam')}
            </p>
            <p className="text-sm mt-4">
              {t('expiration')}
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full mt-2">
              <Link href="/login" className="w-full flex items-center justify-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t('backToLogin')}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 