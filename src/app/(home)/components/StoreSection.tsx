'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { FiArrowRight, FiShoppingBag, FiTruck, FiAward } from 'react-icons/fi';
import { useTranslations } from 'next-intl';

export default function StoreSection() {
  const t = useTranslations('Home.store');
  
  return (
    <section id="shop" className="container mx-auto px-4 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl md:text-4xl font-bold">{t('title')}</h2>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <FiShoppingBag className="h-5 w-5 text-primary" />
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="flex flex-col lg:flex-row-reverse p-8 md:p-10 gap-10 items-center">
          {/* Conteúdo textual à direita (ordem invertida) */}
          <div className="lg:w-1/2">
            <div className="space-y-5">
              <h3 className="text-2xl md:text-3xl font-semibold leading-tight">{t('subtitle')}</h3>
              
              <p className="text-muted-foreground text-lg">
                {t('description')}
              </p>
              
              <div className="space-y-4 py-2">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FiTruck className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-md">
                    <span className="font-medium">{t('delivery.title')}</span> - {t('delivery.description')}
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FiAward className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-md">
                    <span className="font-medium">{t('quality.title')}</span> - {t('quality.description')}
                  </p>
                </div>
              </div>
              
              <p className="text-muted-foreground text-lg">
                {t('conclusion')}
              </p>
              
              <div className="pt-4">
                <Button size="lg" className="group w-full md:w-auto" asChild>
                  <a href="https://www.furia.gg/" target="_blank" rel="noreferrer">
                    {t('button')}
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Imagem à esquerda (ordem invertida) */}
          <div className="lg:w-1/2 h-80 lg:h-[450px] relative rounded-lg overflow-hidden w-full bg-black flex items-center justify-center p-8">
            <Image 
              src="https://res.cloudinary.com/dnuayiowd/image/upload/v1745704616/CAMISA_weqfor.png"
              alt={t('imageAlt')}
              width={400}
              height={400}
              className="object-contain select-none max-h-full max-w-full"
              draggable={false}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
