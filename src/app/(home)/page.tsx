import ContactSection from '@/app/(home)/components/ContactSection';
import FanSection from '@/app/(home)/components/FanSection';
import HeroSection from '@/app/(home)/components/HeroSection';
import StoreSection from '@/app/(home)/components/StoreSection';

// Desabilitar cache para atualizações de idioma
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full py-8 space-y-8">
        <HeroSection />
        <FanSection />
        <StoreSection />
        <ContactSection />
    </main>
  );
}
