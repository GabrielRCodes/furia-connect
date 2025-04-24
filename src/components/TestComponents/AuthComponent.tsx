'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn } from "lucide-react";

export default function AuthComponent() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleNavigateToLogin = () => {
    router.push('/login');
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
  };

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'loading' ? (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="h-12 w-12 rounded-full bg-muted animate-pulse mb-4"></div>
            <p className="text-sm text-muted-foreground">{t('loading')}</p>
          </div>
        ) : session ? (
          <div className="flex flex-col items-center justify-center py-2">
            <div className="h-16 w-16 mb-4 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {session.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt={session.user.name || 'Avatar'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-semibold">{session.user?.name?.charAt(0) || 'U'}</span>
              )}
            </div>
            
            <div className="text-center mb-4">
              <p className="font-medium">{session.user?.name}</p>
              <p className="text-sm text-muted-foreground">{session.user?.email}</p>
            </div>
            
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t('signOut')}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground">{t('notLoggedIn')}</p>
            </div>
            <Button variant="default" onClick={handleNavigateToLogin}>
              <LogIn className="mr-2 h-4 w-4" />
              {t('signIn')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 