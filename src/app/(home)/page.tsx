import HeroSection from '@/app/(home)/components/HeroSection';

// Desabilitar cache para atualizações de idioma
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full">
        <HeroSection />
        
        {/* Aqui serão adicionadas outras seções no futuro */}
      </div>
    </main>
  );
}
