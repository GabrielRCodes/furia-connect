import { useTranslations } from 'next-intl';
import ServerComponent from '../components/TestComponents/ServerComponent';
import ClientComponent from '../components/TestComponents/ClientComponent';
import ThemeComponent from '../components/TestComponents/ThemeComponent';
import ToastTestComponent from '../components/TestComponents/ToastTestComponent';
import AuthComponent from '../components/TestComponents/AuthComponent';

// Desabilitar cache para atualizações de idioma
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Home() {
  const t = useTranslations('Index');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-5xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ToastTestComponent />
          <AuthComponent />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ServerComponent />
          <ClientComponent />
          <ThemeComponent />
        </div>
    </div>
    </main>
  );
}
